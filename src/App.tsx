import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

import { ProductSection } from './components/ProductSection'
import { IRepayment } from "./components/RepaymentsTable";

import './App.css';


interface IProductConfig {
    amount_min: number;
    amount_max: number;
    duration_min: number;
    duration_max: number;
}


function App(): JSX.Element {
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

    const [rcfRates, setRcfRates] = useState<IRepayment[]>([]);
    const [blRates, setBlRates] = useState<IRepayment[]>([]);
    const [amount, setAmount] = useState<number>(initialAmount);
    const [duration, setDuration] = useState<number>(initialDuration);
    const [rCFInterestRate, setRCFInterestRate] = useState<number>(initialRCFInterestRate);
    const [bLInterestRate, setBLInterestRate] = useState<number>(initialBLInterestRate);

    const [configLoaded, setConfigLoaded] = useState<boolean>(false);

    const [rcfConfig, setRcfConfig] = useState<IProductConfig | null>(null);
    const [blConfig, setBlConfig] = useState<IProductConfig | null>(null)

    const [rcfValid, setRcfValid] = useState<boolean>(false);
    const [blValid, setBlValid] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string>('');


    useEffect(() => {
        (async () => {
            try {
                const config = await axios.get(configUrl);
                const configData = config.data;

                setRcfConfig(configData.revolving_credit_facility);
                setBlConfig(configData.business_loan);
                setConfigLoaded(true);
            }
            catch (err) {
                setErrorMessage("Ooops, could not load application's configuration");
                console.error("error:", err);
            }
        })()
    }, []);

    useEffect(() => {
        const bLInitialFee = amount / bLInitialFeePercent;
        const year = new Date().getFullYear();
        const currentMonth = new Date().getUTCMonth();
        const day = new Date().getUTCDay() + 1;

        const calculateRates = (interestRate: number, initialFee: number): IRepayment[] => {
            const rates: IRepayment[] = [];
            if (duration <= 1) {
                return rates;
            }
            const principal = amount / duration;
            for (let month = 1; month <= duration; month++) {
                const dateString = (new Date(Date.UTC(year, currentMonth + month, day))).toLocaleDateString();
                const baseInterest = (amount - principal * (month - 1)) * interestRate / 100;
                const interest = month === 1
                    ? baseInterest + initialFee
                    : baseInterest;
                const total = principal + interest;
                rates.push({
                    dateString,
                    principal,
                    interest,
                    total
                });
            }
            return rates;
        };

        const isProductValid = (productConfig: IProductConfig | null): boolean => {
            return productConfig
                ? amount >= productConfig.amount_min
                    && amount <= productConfig.amount_max
                    && duration >= productConfig.duration_min
                    && duration <= productConfig.duration_max
                : false;
        }
        setRcfRates(calculateRates(rCFInterestRate, 0));
        setBlRates(calculateRates(bLInterestRate, bLInitialFee));
        setRcfValid(isProductValid(rcfConfig));
        setBlValid(isProductValid(blConfig));
    }, [amount, duration, rCFInterestRate, bLInterestRate, rcfConfig, blConfig]);

    const onDurationChange = (ev: ChangeEvent<HTMLInputElement>): void => {
        setDuration(parseInt(ev.target.value));
    };

    const onAmountChange = (ev: ChangeEvent<HTMLInputElement>): void => {
        setAmount(parseInt(ev.target.value));
    };

    const onRCFInterestChange = (newRate: number): void => {
        setRCFInterestRate(newRate);
    };

    const onBLInterestChange = (newRate: number): void => {
        setBLInterestRate(newRate);
    };

    const renderForm = (): JSX.Element => (
        <form>
            <div>
                <label>
                    Amount requested
                    <input
                        className='amount'
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
    );

    const renderTables = (): JSX.Element => (
        <div style={{ display: 'flex', padding: 44 }}>
            <span style={{ width: '50%' }}>
                <ProductSection
                    title='Revolving Credit Facility'
                    productValid={rcfValid}
                    repayments={rcfRates}
                    interestRate={rCFInterestRate}
                    onInterestChange={onRCFInterestChange}
                />
            </span>
            <span style={{ width: '50%', marginLeft: 44 }}>
                <ProductSection
                    title='Business Loan'
                    productValid={blValid}
                    repayments={blRates}
                    interestRate={bLInterestRate}
                    onInterestChange={onBLInterestChange}
                />
            </span>
        </div>
    )

    const renderMain = (): JSX.Element => (
        <>
            {renderForm()}
            {renderTables()}
        </>
    );

    return (
        <div className="App">
            <header className="App-header">
                {configLoaded
                    ? renderMain()
                    : errorMessage
                        ? <div>errorMessage</div>
                        : <div>Loading...</div>
                }
            </header>
        </div>
    );
}

export default App;
