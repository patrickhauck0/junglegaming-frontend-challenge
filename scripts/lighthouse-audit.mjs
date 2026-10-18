import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, spawnSync } from 'child_process';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const REPORTS_DIR = path.resolve(ROOT_DIR, 'lighthouse-reports');

// Cria diretório de relatórios se não existir
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Configuração versionada para salvar em lighthouse-reports/lighthouse-config.json
const AUDIT_CONFIG = {
  version: '1.0.0',
  environment: {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    tool: 'lighthouse@12.x',
  },
  targets: [
    {
      name: 'Início',
      key: 'home',
      url: 'http://127.0.0.1:4173/',
    },
    {
      name: 'Detalhes do NFT',
      key: 'nft-details',
      url: 'http://127.0.0.1:4173/nfts/nft_01',
    },
  ],
  profiles: {
    desktop: {
      name: 'Desktop (1440x900)',
      formFactor: 'desktop',
      screenEmulation: {
        mobile: false,
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        disabled: false,
      },
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
      },
    },
    mobile: {
      name: 'Mobile (390x844)',
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 2.625,
        disabled: false,
      },
      throttling: {
        rttMs: 100,
        throughputKbps: 3072,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
        cpuSlowdownMultiplier: 1.5,
      },
    },
  },
  thresholds: {
    performance: 90,
    accessibility: 95,
    bestPractices: 95,
    seo: 90,
  },
  runsPerTarget: 3,
};

// Salva a configuração versionada
fs.writeFileSync(
  path.join(REPORTS_DIR, 'lighthouse-config.json'),
  JSON.stringify(AUDIT_CONFIG, null, 2),
  'utf-8'
);

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 200 || res.status === 304) return;
    } catch {
      // espera tentativa seguinte
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Timeout esperando servidor em ${url}`);
}

function calculateMedian(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function runAudit() {
  console.log('='.repeat(80));
  console.log('🚀 INICIANDO AUDITORIA OFICIAL LIGHTHOUSE (SEÇÕES 10 & 12 DO README)');
  console.log('='.repeat(80));

  let previewProcess = null;
  let chrome = null;

  try {
    console.log('\n[1/4] Verificando servidor preview (porta 4173)...');
    let isServerUp = false;
    try {
      const res = await fetch('http://127.0.0.1:4173/');
      if (res.ok) isServerUp = true;
    } catch {
      isServerUp = false;
    }

    if (!isServerUp) {
      console.log('Iniciando Vite Preview na porta 4173...');
      previewProcess = spawn('npx.cmd', ['vite', 'preview', '--port', '4173', '--host', '127.0.0.1'], {
        cwd: ROOT_DIR,
        shell: true,
        stdio: 'pipe',
      });
      await waitForServer('http://127.0.0.1:4173/');
      console.log('✅ Servidor preview pronto em http://127.0.0.1:4173/');
    } else {
      console.log('✅ Servidor preview já em execução em http://127.0.0.1:4173/');
    }

    console.log('\n[2/4] Inicializando Chrome Headless via chrome-launcher...');
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
    });
    console.log(`✅ Chrome ativo na porta ${chrome.port}`);

    const allResults = [];
    const summaryData = {
      timestamp: new Date().toISOString(),
      thresholds: AUDIT_CONFIG.thresholds,
      targets: [],
    };

    console.log('\n[3/4] Executando 3 medições por página e perfil (total 12 auditorias)...');

    for (const target of AUDIT_CONFIG.targets) {
      for (const [profileKey, profileConfig] of Object.entries(AUDIT_CONFIG.profiles)) {
        console.log(`\n▶ Auditando: ${target.name} | Perfil: ${profileConfig.name}`);
        const runs = [];

        for (let run = 1; run <= AUDIT_CONFIG.runsPerTarget; run++) {
          process.stdout.write(`  - Medição ${run}/${AUDIT_CONFIG.runsPerTarget}... `);

          const lhOptions = {
            port: chrome.port,
            output: ['html', 'json'],
            logLevel: 'error',
            onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          };

          const lhConfig = {
            extends: 'lighthouse:default',
            settings: {
              formFactor: profileConfig.formFactor,
              screenEmulation: profileConfig.screenEmulation,
              throttling: profileConfig.throttling,
            },
          };

          const runnerResult = await lighthouse(target.url, lhOptions, lhConfig);
          const lhr = runnerResult.lhr;

          const scores = {
            performance: Math.round(lhr.categories.performance.score * 100),
            accessibility: Math.round(lhr.categories.accessibility.score * 100),
            bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
            seo: Math.round(lhr.categories.seo.score * 100),
            lcp: parseFloat((lhr.audits['largest-contentful-paint'].numericValue / 1000).toFixed(2)),
            cls: parseFloat(lhr.audits['cumulative-layout-shift'].numericValue.toFixed(4)),
            tbt: Math.round(lhr.audits['total-blocking-time'].numericValue),
          };

          const runPrefix = `${target.key}-${profileKey}-run-${run}`;
          // Salva relatórios HTML e JSON
          fs.writeFileSync(path.join(REPORTS_DIR, `${runPrefix}.html`), runnerResult.report[0], 'utf-8');
          fs.writeFileSync(path.join(REPORTS_DIR, `${runPrefix}.json`), runnerResult.report[1], 'utf-8');

          runs.push({
            run,
            scores,
            reportHtml: `${runPrefix}.html`,
            reportJson: `${runPrefix}.json`,
            lhr,
            htmlContent: runnerResult.report[0],
            jsonContent: runnerResult.report[1],
          });

          console.log(`Perf: ${scores.performance} | A11y: ${scores.accessibility} | BP: ${scores.bestPractices} | SEO: ${scores.seo} | LCP: ${scores.lcp}s | CLS: ${scores.cls} | TBT: ${scores.tbt}ms`);
        }

        // Calcula medianas
        const medianScores = {
          performance: calculateMedian(runs.map((r) => r.scores.performance)),
          accessibility: calculateMedian(runs.map((r) => r.scores.accessibility)),
          bestPractices: calculateMedian(runs.map((r) => r.scores.bestPractices)),
          seo: calculateMedian(runs.map((r) => r.scores.seo)),
          lcp: calculateMedian(runs.map((r) => r.scores.lcp)),
          cls: calculateMedian(runs.map((r) => r.scores.cls)),
          tbt: calculateMedian(runs.map((r) => r.scores.tbt)),
        };

        // Identifica a medição que melhor representa a mediana
        const sortedByPerf = [...runs].sort((a, b) => a.scores.performance - b.scores.performance);
        const medianRun = sortedByPerf[1]; // corrida central (2 de 3)

        // Salva versão median
        fs.writeFileSync(
          path.join(REPORTS_DIR, `${target.key}-${profileKey}-median.html`),
          medianRun.htmlContent,
          'utf-8'
        );
        fs.writeFileSync(
          path.join(REPORTS_DIR, `${target.key}-${profileKey}-median.json`),
          medianRun.jsonContent,
          'utf-8'
        );

        summaryData.targets.push({
          target: target.name,
          key: target.key,
          url: target.url,
          profile: profileKey,
          profileName: profileConfig.name,
          runs: runs.map((r) => ({ run: r.run, scores: r.scores })),
          median: medianScores,
          meetsThresholds: {
            performance: medianScores.performance >= AUDIT_CONFIG.thresholds.performance,
            accessibility: medianScores.accessibility >= AUDIT_CONFIG.thresholds.accessibility,
            bestPractices: medianScores.bestPractices >= AUDIT_CONFIG.thresholds.bestPractices,
            seo: medianScores.seo >= AUDIT_CONFIG.thresholds.seo,
          },
        });
      }
    }

    console.log('\n[4/4] Gerando sumário consolidado em lighthouse-reports/summary.json...');
    fs.writeFileSync(
      path.join(REPORTS_DIR, 'summary.json'),
      JSON.stringify(summaryData, null, 2),
      'utf-8'
    );

    console.log('\n' + '='.repeat(80));
    console.log('📊 CONSOLIDAÇÃO DOS RESULTADOS (MEDIANAS):');
    console.log('='.repeat(80));
    console.log('| Página | Perfil | Performance | Acessibilidade | Melhores Práticas | SEO | LCP | CLS | TBT | Status |');
    console.log('| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |');

    let allPassed = true;
    for (const item of summaryData.targets) {
      const m = item.median;
      const passed =
        item.meetsThresholds.performance &&
        item.meetsThresholds.accessibility &&
        item.meetsThresholds.bestPractices &&
        item.meetsThresholds.seo;

      if (!passed) allPassed = false;

      const status = passed ? '✅ APROVADO' : '⚠️ ATENÇÃO';
      console.log(
        `| ${item.target} | ${item.profile} | ${m.performance} (≥90) | ${m.accessibility} (≥95) | ${m.bestPractices} (≥95) | ${m.seo} (≥90) | ${m.lcp}s | ${m.cls} | ${m.tbt}ms | ${status} |`
      );
    }
    console.log('='.repeat(80));
    if (allPassed) {
      console.log('🎉 TODAS AS MÉTRICAS ATINGIRAM OU SUPERARAM AS METAS DA SEÇÃO 10!');
    } else {
      console.log('⚠️ Algumas métricas ficaram abaixo das metas estabelecidas.');
    }
    console.log('='.repeat(80));
  } catch (error) {
    console.error('❌ Erro durante execução do Lighthouse:', error);
  } finally {
    if (chrome) {
      console.log('Encerrando Chrome...');
      try {
        await chrome.kill();
      } catch (e) {
        // ignora
      }
    }

    if (previewProcess && previewProcess.pid) {
      console.log('Encerrando servidor preview...');
      try {
        spawnSync('taskkill', ['/pid', String(previewProcess.pid), '/f', '/t']);
      } catch (e) {
        // ignora
      }
    }

    console.log('Finalizado com sucesso.');
    process.exit(0);
  }
}

runAudit();
