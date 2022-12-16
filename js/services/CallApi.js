const URL = `https://637b699b10a6f23f7fa80af9.mockapi.io/api/toDO`;
export default class CallApiServices{
    callApi(uri, method, data){
        return axios({
            url: `${URL}/${uri}`,
            method,
            data,
        })
    }
}