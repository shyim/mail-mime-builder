import {test} from 'node:test'
import assert from 'node:assert/strict'
import {Mailbox} from 'mail-mime-builder'

const input1 = 'test@mail.com'
const input2 = 'Test Lorem Ipsum <test@mail.com>'
const input3 = {addr: 'test@mail.com', name: 'Test Lorem Ipsum', type: 'From'}
const input4 = 'LoremIpsum<test@mail.com>'
const input5 = '"LoremIpsum" <test@mail.com>'

test('it accepts objects and texts in a certain format.', () => {
    const mail = new Mailbox(input1)
    assert.equal(mail.addr, input1)
    assert.equal(mail.name, '')
    assert.equal(mail.type, 'To')

    const mail2 = new Mailbox(input2)
    assert.equal(mail2.addr, 'test@mail.com')
    assert.equal(mail2.name, 'Test Lorem Ipsum')
    assert.equal(mail2.type, 'To')

    const mail3 = new Mailbox(input3)
    assert.equal(mail3.addr, 'test@mail.com')
    assert.equal(mail3.name, 'Test Lorem Ipsum')
    assert.equal(mail3.type, 'From')

    const mail4 = new Mailbox(input4)
    assert.equal(mail4.addr, 'test@mail.com')
    assert.equal(mail4.name, 'LoremIpsum')
    assert.equal(mail4.type, 'To')

    const mail5 = new Mailbox(input5)
    assert.equal(mail5.addr, 'test@mail.com')
    assert.equal(mail5.name, 'LoremIpsum')
    assert.equal(mail5.type, 'To')
})

test('gets domain part of the address', () => {
    assert.equal(new Mailbox('test@mail.com').getAddrDomain(), 'mail.com')
})

test('dumps address', () => {
    assert.equal(new Mailbox(input1).dump(), '<test@mail.com>')
    assert.equal(new Mailbox(input2).dump(), '"Test Lorem Ipsum" <test@mail.com>')
    assert.equal(new Mailbox(input3).dump(), '"Test Lorem Ipsum" <test@mail.com>')
})
