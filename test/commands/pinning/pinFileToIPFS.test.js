import axios from 'axios';
import pinFileToIPFS from'../../../src/commands/pinning/pinFileToIPFS';
import fs from 'fs';
import NodeFormData from 'form-data';
jest.mock('axios');

//common values
const nonStream = 'test';
const validStream = fs.createReadStream('./pinata.png');
const validFormData = new NodeFormData();
validFormData.append('file', validStream, {filepath: 'test/filepath'});


test('non-readableStream and non-formData is passed in', () => {
    expect(pinFileToIPFS('test', 'test', nonStream)).rejects.toEqual(Error('readStream is not a readable stream or form data'));

    return undefined;
});

test('200 status is returned with valid stream', () => {
    const goodStatus = {
        status: 200,
        data: 'testData'
    };
    axios.post.mockResolvedValue(goodStatus);
    expect.assertions(1);
    expect(pinFileToIPFS('test', 'test', validStream)).resolves.toEqual(goodStatus.data);
});

test('200 status is returned with valid form data', () => {
    const goodStatus = {
        status: 200,
        data: 'testData'
    };
    axios.post.mockResolvedValue(goodStatus);
    expect.assertions(1);
    expect(pinFileToIPFS('test', 'test', validFormData)).resolves.toEqual(goodStatus.data);
});

test('Result other than 200 status is returned', () => {
    const badStatus = {
        status: 700
    };
    axios.post.mockResolvedValue(badStatus);
    expect.assertions(1);
    expect(pinFileToIPFS('test', 'test', validStream)).rejects.toEqual(Error(`unknown server response while pinning File to IPFS: ${badStatus}`));
});

test('Rejection handled', () => {
    axios.post.mockRejectedValue('test error');
    expect.assertions(1);
    expect(pinFileToIPFS('test', 'test', validStream)).rejects.toEqual('test error');
});


