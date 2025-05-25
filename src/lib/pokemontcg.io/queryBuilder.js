import axios from 'axios';
import qs from 'qs';
import configuration from './configure';

const getOptions = () => {
    const options = {
        headers: {},
        timeout: 30000 // 30 seconds timeout
    };

    if (configuration.apiKey) {
        options.headers['X-Api-Key'] = configuration.apiKey;
    }

    return options;
};

const get = (type, args) => {
    return axios.get(`${configuration.host}/${type}${args ? '?' + qs.stringify(args) : ''}`, getOptions())
        .then(response => response.data);
};

export default (type) => ({
    find: (id) => {
        return axios.get(`${configuration.host}/${type}/${id}`, { ...getOptions(), timeout: 30000 })
            .then(response => response.data.data);
    },
    where: (args) => get(type, args),
    all: (args = {}, data = []) => {
        const getAll = (type, args) => {
            const page = args.page ? args.page + 1 : 1;

            return get(type, { ...args, page })
                .then(response => {
                    const responseData = response.data || [];
                    data.push(...responseData);

                    if (!response.pageSize || (response.pageSize * response.page) >= response.count) {
                        return data;
                    }

                    return getAll(type, { ...args, page });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    return data;
                });
        };
        return getAll(type, args);
    }
});
