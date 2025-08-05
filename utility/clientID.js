const getClientID = () => {
    const clientIdArg = process.argv.find(arg => arg.startsWith('--clientId='));
    return clientIdArg ? clientIdArg.split('=')[1] : 'defaultClient';
}

module.exports = getClientID