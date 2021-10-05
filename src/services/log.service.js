import axios from 'axios'

const api = axios.create({baseURL:'https://localhost:44312/api'});

export class LogService {

     getLogs() {
        return  api.get('/Logger?PageNumber=1&PageSize=10').then(res=>res).then(d => d.items);
    }

    
}
