module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name      : 'API',
      script    : 'src',
      watch     : false,
      exec_mode : "cluster_mode",
      instances : "max",
      ignoreWatch: ['.idea/*', '.git/*'],
      log_date_format : "DD-MM-YY HH:mm",
      env: {
        NODE_ENV: "development",
      },
      env_staging : {
        NODE_ENV: 'production',
      },
      env_production : {
        NODE_ENV: 'production',
      },
    },
    {
      name      : 'API_LOCAL',
      script    : 'src',
      watch     : true,
      exec_mode : "fork",
      ignoreWatch: ['.idea/*', '.git/*'],
      log_date_format : "DD-MM-YY HH:mm",
      env: {
        NODE_ENV: "development",
        node_args: ["--debug=7000"]
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/development',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
