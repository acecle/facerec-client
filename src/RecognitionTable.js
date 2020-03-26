import React, { Component } from 'react';
import axios from 'axios';

class RecognitionTable extends Component {

    constructor(props) {
        super(props);

        this.state = {data: []};

    }

    componentDidMount() {
        axios({
            method: 'get',
            url: 'https://acecle-facerec-test-server.herokuapp.com/recognitions', //http://localhost:5000/recognitions
        }).then((response) => {
            console.log(response.data);
            this.setState({data: response.data})
        }).catch((response) => {
            //console.log(response);
        });
        return null
    }

    render() {
        
        const tdStyle = {
            textAlign: 'center',
            padding: '10px 0',
        };

        const tableStyle = {
            borderCollapse: 'seperate',
            borderSpacing: '10px 0',
        };

        return (
            <div>
                {
                
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Expected</th>
                            <th>Time</th>
                            <th>Room</th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        {this.state.data.map((data, index) => (
                            <tr key={index}>
                                <td style={tdStyle}>{data['name']}</td>
                                <td style={tdStyle}>{data['expected']}</td>
                                <td style={tdStyle}>{new Date(data['time']['$date']).toUTCString()}</td>
                                <td style={tdStyle}>{data['room']}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                }
            </div>
        )
    }

}

export default RecognitionTable;