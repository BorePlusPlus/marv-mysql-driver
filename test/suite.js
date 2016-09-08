var Hath = require('hath')
var complianceTests = require('marv-compliance-tests')
var driverTests = require('./driver-tests')
var driver = require('..')
var mysql = require('mysql')

function setup(t, done) {
    var config = {
        table: 'mysql_migrations',
        connection: {
            host: 'localhost',
            port: 3306,
            database: 'marv_tests',
            user: 'root',
            password: '',
            multipleStatements: true
        }
    }
    t.locals.config = config
    t.locals.driver = driver(config)
    t.locals.driver2 = driver(config)
    t.locals.migration = {
        level: 1,
        comment: 'test migration',
        script: 'SELECT 1',
        timestamp: new Date(),
        checksum: '401f1b790bf394cf6493425c1d7e33b0'
    }
    var connection = mysql.createConnection({ user: 'root' })
    connection.connect(function(err) {
        if (err) throw err
        connection.query('CREATE DATABASE IF NOT EXISTS marv_tests', function(err) {
            if (err) throw err
            connection.end(done)
        })
    })
}

module.exports = Hath.suite('MySQL Driver Tests', [
    setup,
    complianceTests,
    driverTests
])

if (module === require.main) {
  module.exports(new Hath())
}