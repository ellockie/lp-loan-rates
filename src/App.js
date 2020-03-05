import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    const [rcfRates, setRcfRates] = useState([1, 2, 3]);
    const [blRates, setBlRates] = useState([4, 5, 6]);
    const [amount, setAmount] = useState(10000);
    const [duration, setDuration] = useState(4);
    const [rCFInterestRate, setRCFInterestRate] = useState(3);
    const [bLInterestRate, setBLInterestRate] = useState(3);

    // useEffect(() => {
    //     setDuration(5);
    // },[]);
    useEffect(() => {
        // tslint:disable-next-line:no-console
        console.log('duration, rCFInterestRate:', duration, rCFInterestRate, bLInterestRate);

        const calculateRcfRates = () => {
            const rates = [];
            for (let i = 0; i < duration; i++) {
                rates.push(i * rCFInterestRate / 100);
            }
            setRcfRates(rates);
        };

        const calculateBlRates = () => {
            const rates = [];
            for (let i = 0; i < duration; i++) {
                rates.push(i * 2 * bLInterestRate / 100);
            }
            setBlRates(rates);
        };

        calculateRcfRates();
        calculateBlRates();
    }, [duration, rCFInterestRate, bLInterestRate]);

    const onDurationChange = (ev) => {
        setDuration(ev.target.value);
    };

    const onAmountChange = (ev) => {
        setAmount(ev.target.value);
    };

    const onRCFInterestChange = (value) => {
        setRCFInterestRate(value);
    };

    const onBLInterestChange = (value) => {
        setBLInterestRate(value);
    };

    // const setRates = () => {}
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <form>
                    <div>
                        <label>
                            Amount requested <input type="number" value={amount} onChange={onAmountChange}/> (in £)
                        </label>
                    </div>
                    <div>
                        Duration <input type="number" value={duration} onChange={onDurationChange}/> (in months)
                    </div>
                </form>
                <div style={{display: 'flex', padding: 44}}>
                    <span>
                        <TableSection items={rcfRates} interestRate={rCFInterestRate} onInterestChange={onRCFInterestChange}></TableSection>
                    </span>
                    <span style={{marginLeft: 44}}>
                        <TableSection items={blRates} interestRate={bLInterestRate} onInterestChange={onBLInterestChange}></TableSection>
                    </span>
                </div>
            </header>
        </div>
    );
}

const TableSection = (props) => {
    const {items, interestRate} = props;

    const onInterestRateChange = (ev) => {
        props.onInterestChange(ev.target.value);
    };
    return (
        <div style={{backgroundColor: '#444', padding: 22}}>
            <form>
                <label>
                    Interest rate <input type="text" value={interestRate} onChange={onInterestRateChange}/> (in %)
                </label>
            </form>
            <Table items={items}></Table>
        </div>
    )
}

const Table = (props) => {
    const {items} = props;
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>af</th>
                        <th>afa</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item =>
                        (<tr key={item}>
                            <td>{"af " + item}</td>
                            <td>{"saf " + item}</td>
                        </tr>)
                    )}
                </tbody>
            </table>
        </>
    )
}

export default App;
