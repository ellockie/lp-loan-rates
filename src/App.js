import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const initialAmount = 10000;
    const minAmount = 100;
    const maxAmount = 1000000;
    const initialDuration = 4;
    const minDuration = 1;
    const maxDuration = 30 * 12;
    const initialRCFInterestRate = 3;
    const initialBLInterestRate = 3;
    const bLInitialFeePercent = 10;
    const configUrl = 'http://www.mocky.io/v2/5d4aa9e93300006f000f5ea9'

    const [rcfRates, setRcfRates] = useState([]);
    const [blRates, setBlRates] = useState([]);
    const [amount, setAmount] = useState(initialAmount);
    const [duration, setDuration] = useState(initialDuration);
    const [rCFInterestRate, setRCFInterestRate] = useState(initialRCFInterestRate);
    const [bLInterestRate, setBLInterestRate] = useState(initialBLInterestRate);

    const [configLoaded, setConfigLoaded] = useState(false);

    const [rcfConfig, setRcfConfig] = useState({})
    const [blConfig, setBlConfig] = useState({})

    const [rcfValid, setRcfValid] = useState(false);
    const [blValid, setBlValid] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const config = await axios.get(configUrl);
                const configData = config.data;

                setRcfConfig(configData.revolving_credit_facility);
                setBlConfig(configData.business_loan);
                setConfigLoaded(true)
            }
            catch (err) {
                console.error("error:", err);
            }
        })()
    }, []);

    useEffect(() => {
        const bLInitialFee = amount / bLInitialFeePercent;
        const year = new Date().getFullYear();
        const currentMonth = new Date().getUTCMonth();
        const day = new Date().getUTCDay() + 1;

        const calculateRates = (interestRate, initialFee) => {
            const rates = [];
            const principal = amount / duration;
            for (let month = 1; month <= duration; month++) {
                const date =  (new Date(Date.UTC(year, currentMonth + month, day))).toLocaleDateString();
                const baseInterest = (amount - principal * (month - 1)) * interestRate / 100;
                const interest = month === 1
                    ? baseInterest + initialFee
                    : baseInterest;
                const total = principal + interest;
                rates.push({
                    date,
                    principal,
                    interest,
                    total
                });
            }
            return rates;
        };
        const isProductValid = (productConfig) => {
            return amount >= productConfig.amount_min
                && amount <= productConfig.amount_max
                && duration >= productConfig.duration_min
                && duration <= productConfig.duration_max;
        }
        setRcfRates(calculateRates(rCFInterestRate, 0));
        setBlRates(calculateRates(bLInterestRate, bLInitialFee));
        setRcfValid(isProductValid(rcfConfig));
        setBlValid(isProductValid(blConfig));
    }, [amount, duration, rCFInterestRate, bLInterestRate, rcfConfig, blConfig]);

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


    const renderForm = () => {
        return (
            <form>
                <div>
                    <label>
                        Amount requested
                        <input
                            type="number"
                            value={amount}
                            min={minAmount}
                            max={maxAmount}
                            onChange={onAmountChange}
                        />
                        (£)
                    </label>
                </div>
                <div>
                    Duration
                    <input
                        type="number"
                        value={duration}
                        min={minDuration}
                        max={maxDuration}
                        onChange={onDurationChange}
                    />
                    (months)
                </div>
            </form>
        )
    };

    const renderTables = () => {
        return (
            <div style={{display: 'flex', padding: 44}}>
                <span style={{width: '50%'}}>
                    <ProductSection
                        title='Revolving Credit Facility'
                        productValid={rcfValid}
                        items={rcfRates}
                        interestRate={rCFInterestRate}
                        onInterestChange={onRCFInterestChange}
                    />
                </span>
                <span style={{width: '50%', marginLeft: 44}}>
                    <ProductSection
                        title='Business Loan'
                        productValid={blValid}
                        items={blRates}
                        interestRate={bLInterestRate}
                        onInterestChange={onBLInterestChange}
                    />
                </span>
            </div>
        );
    }
    const renderMain = () => {
        return (
            <>
                {renderForm()}
                {renderTables()}
            </>
        );
    }

    return (
        <div className="App">
            <header className="App-header">
                {configLoaded
                    ? renderMain()
                    : <div>Loading...</div>
                }
            </header>
        </div>
    );
}

const ProductSection = (props) => {
    const {productValid, items, interestRate} = props;

    const onInterestRateChange = (ev) => {
        props.onInterestChange(ev.target.value);
    };

    return (
        <div style={{backgroundColor: '#444', padding: 22}}>
            <h2>{props.title}</h2>
            {productValid &&
                <>
                    <form>
                        <label>
                            Interest rate
                            <input
                                type="number"
                                value={interestRate}
                                onChange={onInterestRateChange}
                            />
                            (%)
                        </label>
                    </form>
                    <Table items={items}></Table>
                </>
            }
            {!productValid &&
                <div>
                    (This product is not available for your combination of amount and/or duration)
                </div>
            }
        </div>
    )
}

const roundMoney = (amount) => {
    return Math.round((amount * 100) / 100);
}

const Table = (props) => {

    const getColumnTotal = (fieldName) => {
        return props.items.reduce((sum, item) => sum + item[fieldName], 0)
    }

    const getPrincipalTotal = () => {
        return roundMoney(getColumnTotal('principal'));
    }
    const getInterestTotal = () => {
        return roundMoney(getColumnTotal('interest'));
    }
    const getTotal = () => {
        return roundMoney(getColumnTotal('total'));
    }
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Total Repayment</th>
                    </tr>
                </thead>
                <tbody>
                    {props.items.map(item =>
                        (<tr key={item.date}>
                            <td>{item.date}</td>
                            <td>{roundMoney(item.principal)}</td>
                            <td>{roundMoney(item.interest)}</td>
                            <td>{roundMoney(item.total)}</td>
                        </tr>)
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <th>Total</th>
                        <th>{getPrincipalTotal()}</th>
                        <th>{getInterestTotal()}</th>
                        <th>{getTotal()}</th>
                    </tr>
                </tfoot>
            </table>
        </>
    )
}

export default App;
