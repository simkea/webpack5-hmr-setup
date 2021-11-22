import axios from 'axios';
import { AJAX_CONTENT_TYPE_XFORM, BASE_API } from '../constants';

const defaultOptions = {
    method: 'post',
    headers: { 'Content-Type': AJAX_CONTENT_TYPE_XFORM },
};

export default function request(controller, action, options = { sessionId: null }) {
    const formData = new FormData();

    if (options.sessionId) {
        formData.append('sid', options.sessionId);
    }

    if (options.data) {
        Object.entries(options.data).forEach(entry => {
            formData.append(...entry);
        });
    }

    const url = `${BASE_API}${controller}/${action}`;

    const processedOptions = {
        ...defaultOptions,
        ...options,
        data: formData,
        url,
    };

    return axios(processedOptions);
}
