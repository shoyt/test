'use strict'

const path              = require('path')
const fs                = require('fs')
const SQL               = require('sql.js')
const rootPath          = path.join(require('electron-root-path').rootPath, 'application', 'db') 
const dbPath            = path.join(rootPath, 'application.db')

SQL.dbClose             = function (connection) {
                            try {
                              let data    = connection.export()
                              let buffer  = Buffer.alloc(data.length, data)
                              fs.writeFileSync(dbPath, buffer)
                              connection.close()
                              return true
                            } catch (error) {
                              console.log('CANNOT CLOSE DATABASE', error)
                              return false
                            }
                          }

SQL.dbOpen              = function () {
                            try {
                              return new SQL.Database(fs.readFileSync(dbPath))
                            } catch (error) {
                              console.log('CANNOT OPEN DATABASE', error.message)
                              return null
                            }
                          }
                                                
let connect             = function (callback) {
                            let createDb  = function () {
                                              let db      = new SQL.Database()
                                              let query   = fs.readFileSync(path.join(rootPath, 'schema.sql'), 'utf8')
                                              let result  = db.exec(query)
                                              if (Object.keys(result).length  === 0  && typeof result.constructor === 'function') {
                                                console.log('DATABASE CREATED')
                                                return db
                                              }
                                              console.log('module.connect.createDb FAILED')
                                              return false
                                            }
                            let db = SQL.dbOpen()
                            if (db === null) { db = createDb() } 
                            if (db === null){ throw new Error('COULD NOT CONNECT TO DATABASE') }
                            return db
                          }

module.exports.execute  = function (sql, parameters) { 
                            let db 
                            let query
                            let records = []
                            try {
                              db    = connect()
                              query = db.prepare(sql)
                              if (parameters !== undefined) { query.bind(parameters) }
                              while (query.step()) { records.push(query.getAsObject()) } 
                            } catch (error) {
                              console.log('model.execute', error.message)
                            } finally {
                              SQL.dbClose(db)
                              return records
                            }
                          }
