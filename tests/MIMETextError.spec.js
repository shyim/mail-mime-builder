import {test} from 'node:test'
import assert from 'node:assert/strict'
import {MIMETextError} from 'mail-mime-builder'

test('is an instance of native error class', () => {
    const a = new MIMETextError('test error.')
    assert.ok(a instanceof Error)
})

test('takes message and description as arguments', () => {
    const a = new MIMETextError('test1')
    assert.equal(a.name, 'test1')

    const b = new MIMETextError('test2', 'description')
    assert.equal(b.name, 'test2')
    assert.equal(b.message, 'description')
})
