import axios from 'axios';

/**
 * 创建一个新的 Axios 实例
 * @param {object} config - 自定义配置对象
 * @returns {object} - Axios 实例
 */
/**
 * 创建一个 Axios 实例，并配置默认设置和拦截器。
 * @param {Object} config - 可选的自定义配置对象，将与默认配置合并。
 * @returns {Object} 返回配置好的 Axios 实例。
 *
 * 默认配置包括：
 * - 请求超时时间设置为 30 秒。
 * - 状态码验证范围为 200 到 500。
 * - 允许跨域请求携带凭证。
 *
 * 该函数还添加了请求和响应拦截器：
 * - 请求拦截器会在请求发送前打印请求信息，并处理请求错误。
 * - 响应拦截器会检查响应状态码，非 200 状态码将被视为错误，并打印警告信息和错误详情，
 *   同时处理响应阶段的错误。
 */
const createAxiosInstance = (config = {}) => {
    const defaultConfig = {
        timeout: 30000, // 请求超时时间
        validateStatus: status => status >= 200 && status <= 500, // 默认的状态码验证
        withCredentials: true, // 允许跨域携带凭证
    };

    // 合并默认配置与传入配置
    const instance = axios.create({ ...defaultConfig, ...config });

    /**
     * 请求拦截器
     */
    instance.interceptors.request.use(
        requestConfig => {
            // 请求发送前的逻辑
            // console.log('发起请求:', {
            //     url: requestConfig.url,
            //     method: requestConfig.method,
            //     headers: requestConfig.headers,
            //     params: requestConfig.params,
            //     data: requestConfig.data,
            // });
            return requestConfig;
        },
        error => {
            // 捕获请求阶段的错误
            console.error('请求拦截器错误:', {
                url: error?.config?.url,
                method: error?.config?.method,
                headers: error?.config?.headers,
                params: error?.config?.params,
                data: error?.config?.data,
                message: error.message,
            });
            return Promise.reject(error);
        }
    );

    /**
     * 响应拦截器
     */
    instance.interceptors.response.use(
        response => {
            const { status, data, config: resConfig } = response;

            if (status !== 200) {
                // 打印非 200 响应日志
                console.warn(`响应错误: ${status}`, data, {
                    url: resConfig.url,
                    method: resConfig.method,
                    headers: resConfig.headers,
                    params: resConfig.params,
                    data: resConfig.data,
                });
                return Promise.reject(data?.message || '未知错误');
            }

            // 返回响应数据
            return response;
        },
        error => {
            // 捕获响应阶段的错误
            console.error('响应拦截器错误:', {
                url: error?.config?.url,
                method: error?.config?.method,
                headers: error?.config?.headers,
                params: error?.config?.params,
                data: error?.config?.data,
                message: error.message,
            });
            return Promise.reject(error.message || '网络错误');
        }
    );

    return instance;
};

// 导出默认实例
export default createAxiosInstance();
