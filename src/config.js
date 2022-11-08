export const get_config = _get_config;
export const parse_config = _parse_config;

function _get_config(config_path) {
    return new Promise(res => {
        fetch(config_path)
            .then(o => o.json())
            .then(json_config => res(json_config));
    })
}

function _parse_config(config) {
    const { input, output } = config;
    return Promise.all(
        [{ conf: input, type: 'input' }, { conf: output, type: 'output' }].map(obj => {
            return new Promise((res) => {
                const { domQuery, imagePath } = (obj.conf || {});
                if (domQuery) {
                    obj.elem = document.querySelector(domQuery);
                    return res(obj);
                }
                else if (imagePath) {
                    obj.elem = new Image();
                    obj.elem.src = imagePath;
                    obj.elem.addEventListener('load', res.bind(null, obj));
                }
                else {
                    res(obj);
                }
            });
        })
    );
}