import React from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { LogService } from "../../services/log.service";
import axios from 'axios'
import { Ripple } from 'primereact/ripple';
import { Dropdown } from 'primereact/dropdown';
//import { InputText } from 'primereact/inputtext';
//import { classNames } from 'primereact/utils';


class GridContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Logs: [],
            pageNumber : 1 
        };

        this.LogService = new LogService();
    }

    async getData() {
        const res = await axios.get('http://localhost:5000/api/Logger?PageNumber=1&PageSize=10');
        let { data } = await res;
        data.items = data.items.map(item => {
            item.logTime = new Date(item.logTime).toUTCString();
            item.type = item.type.toUpperCase();

            return item
        })
        console.log(data);
        this.setState({ Logs: data.items })
    }

    componentDidMount() {
        this.getData();
        //this.LogService.getLogs().then(data => this.setState({ Logs: data }));
        //console.log(this.state.Logs)
    }

    onPageNext = () =>{
    console.log(this.state)
     this.setState((prevState) => {return {pageNumber: prevState.pageNumber+ 1}}, () => {
        this.loadLogsbyPage();
    });
    
    }

    onPagePrev = () => {
     if(this.state.pageNumber > 1){
        this.setState(prevState =>({pageNumber: prevState.pageNumber-1}),() => {
            this.loadLogsbyPage();
        });
        this.loadLogsbyPage();
     }
    }

    async loadLogsbyPage(){
        const res = await axios.get(`http://localhost:5000/api/Logger?PageNumber=${this.state.pageNumber}&PageSize=10`);
        let { data } = await res;
        data.items = data.items.map(item => {
            item.logTime = new Date(item.logTime).toUTCString();
            item.type = item.type.toUpperCase();

            return item
        })
        this.setState({ Logs: data.items })
    }

    render() {

        const template2 = {
            layout: ' PrevPageLink NextPageLink',
            'PrevPageLink': (options) => {
                return (
                    
                    <button type="button" className={options.className} onClick={this.onPagePrev} disabled={options.disabled}>
                        <span className="p-p-3">Previous</span>
                        <Ripple />
                    </button>
                )
            },
            'NextPageLink': (options) => {
                return (
                    <button type="button" className={options.className} onClick={this.onPageNext} disabled={options.disabled}>
                        <span className="p-p-3">Next</span>
                        <Ripple />
                        &nbsp;	&nbsp;	
                        <span>{this.state.pageNumber}</span>
                    </button>
                )
            },
            'RowsPerPageDropdown': (options) => {
                const dropdownOptions = [
                    { label: 10, value: 10 },
                    { label: 20, value: 20 },
                    { label: 50, value: 50 }
                ];

                return (
                    <>
                        <span className="p-mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>Items per page: </span>
                        <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} appendTo={document.body} />
                    </>
                );
            },
            'CurrentPageReport': (options) => {
                return (
                    <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                        {options.first} - {options.last} of {options.totalRecords}
                    </span>
                )
            }
        };
        const columns = [
            { field: 'type', header: 'Type' },
            { field: 'logTime', header: 'Timestamp' },
            { field: 'message', header: 'Message' }
        ];

        const dynamicColumns = columns.map((col, i) => {
            return <Column key={col.field} field={col.field} header={col.header} />;
        });

        return (
            <DataTable value={this.state.Logs} paginator paginatorTemplate={template2}>{dynamicColumns}</DataTable>
        )
    }
}

export default GridContainer
