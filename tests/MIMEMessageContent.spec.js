import {expect, test} from 'bun:test'
import {MIMEMessageContent} from '../src/MIMEMessageContent'

const eol = '\r\n'

const sampleImageBase64 = '/9j/4AAQSkZJRgABAgEASABIAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgMDAwMDAwMDAwMBAQEBAQEBAgEBAgICAQICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA//AABEIAAUABQMAEQABEQECEQH/xABPAAEAAAAAAAAAAAAAAAAAAAAKEAEBAQEBAQAAAAAAAAAAAAAFBgQDAgEBAQAAAAAAAAAAAAAAAAAAAAARAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwAAARECEQA/AHsDDIlo1m7dWUFHmo6DMyOOzmleB0EdwlZme6ycn1npkJbZP7FgtTvTo7qaV+KtbefPb4N8Hn4A/9k='

test('plain text content', () => {
    const content = new MIMEMessageContent('hello there', {'Content-Type': 'plain/text'})
    expect(content.isAttachment()).toBe(false)
    expect(content.getHeader('Content-Type')).toBe('plain/text')
    expect(content.dump({mixed: 'abcdef', alt: 'ghjklm'})).toBe(
        'Content-Type: plain/text' + eol + eol +
            'hello there'
    )
})

test('base64 encoded image attachment', () => {
    const content = new MIMEMessageContent(sampleImageBase64, {
        'Content-Type': 'image/jpg; charset=UTF-8',
        'Content-Transfer-Encoding': 'base64',
        'Content-Disposition': 'attachment;filename="sample.jpg"'
    })
    expect(content.isAttachment()).toBe(true)
    expect(content.getHeader('Content-Type')).toBe('image/jpg; charset=UTF-8')
    expect(content.dump()).toBe(
        'Content-Type: image/jpg; charset=UTF-8' + eol +
        'Content-Transfer-Encoding: base64' + eol +
        'Content-Disposition: attachment;filename="sample.jpg"' + eol + eol +
        sampleImageBase64
    )
})

test('image attachment and inline attachment together', () => {
    const content = new MIMEMessageContent(sampleImageBase64, {
        'Content-Type': 'image/jpg; charset=UTF-8',
        'Content-Transfer-Encoding': 'base64',
        'Content-Disposition': 'inline;filename="sample.jpg"'
    })
    expect(content.isInlineAttachment()).toBe(true)
    expect(content.getHeader('Content-Type')).toBe('image/jpg; charset=UTF-8')
    expect(content.dump()).toBe(
        'Content-Type: image/jpg; charset=UTF-8' + eol +
        'Content-Transfer-Encoding: base64' + eol +
        'Content-Disposition: inline;filename="sample.jpg"' + eol + eol +
        sampleImageBase64
    )
})