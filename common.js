const logger = {
    'log': (...msgs) => {
        console.log(new Date().toLocaleString() + ': ', ...msgs);
    },
    'warn': (...msgs) => {
        console.warn(new Date().toLocaleString() + ': ', ...msgs);
    },
    'error': (...msgs) => {
        console.error(new Date().toLocaleString() + ': ', ...msgs);
    },
};
