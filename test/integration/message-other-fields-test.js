'use strict'
/* eslint no-unused-expressions: "off" */ // for chai expect assertions

var expect = require('chai').expect
var Event = require('../..').Event
var util = require('../../lib/util')
var TestClient = require('./test-client')

describe('"other fields" in an event message @integration', function () {
  it('should be delivered with the expected content', function (done) {
    var otherFieldsCount = 1000

    var client = new TestClient(this, done)
    client.connect(function () {
      var topic = 'message_other_fields_test_' + util.generateIdAsString()

      var eventToSend = new Event(topic)
      for (var i = 0; i < otherFieldsCount; i++) {
        eventToSend.otherFields['key' + i] = 'value' + i
      }

      client.addEventCallback(topic, function (eventReceived) {
        client.shutdown(null, function () {
          for (var i = 0; i < otherFieldsCount; i++) {
            expect(eventReceived.otherFields['key' + i]).to.eql(
              eventToSend.otherFields['key' + i])
          }
          done()
        })
      })

      client.sendEvent(eventToSend)
    })
  })
})
