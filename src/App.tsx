import React, { useState, useEffect, ChangeEvent } from 'react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react'
import axios from 'axios';
import './App.css';

interface IRepayment {
    dateString: string,
    principal: number,
    interest: number,
    total: number
}

type RepaymentField = 'principal' | 'interest' | 'total';

interface IProductSectionProps {
    title: string,
    productValid: boolean,
    repayments: IRepayment[],
    interestRate: number,
    onInterestChange(newRate: number): void
}

interface IRepaymentsTableProps {
    repayments: IRepayment[]
}

interface IProductConfig {
    amount_min: number,
    amount_max: number,
    duration_min: number,
    duration_max: number,
}

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


    const renderMain = (): JSX.Element => (
        <>
            {renderForm()}
            {renderTables()}
        </>
    );

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

    const renderTables = () => (
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

const ProductSection = (props: IProductSectionProps) => {
    const { productValid, repayments, interestRate } = props;

    const onInterestRateChange = (ev: ChangeEvent<HTMLInputElement>) => {
        props.onInterestChange(parseInt(ev.target.value));
    };

    return (
        <div style={{ backgroundColor: '#444', padding: 22 }}>
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
                    <RepaymentsTable repayments={repayments}></RepaymentsTable>
                    {/* <div><TableExamplePagination/></div> */}
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

const RepaymentsTable = (props: IRepaymentsTableProps) => {

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
    }

    const getColumnTotal = (fieldName: RepaymentField) => {
        return props.repayments
            .reduce((sum: number, repayment: IRepayment) => sum + repayment[fieldName], 0)
    }

    const getPrincipalTotal = () => {
        return formatCurrency(getColumnTotal('principal'));
    }
    const getInterestTotal = () => {
        return formatCurrency(getColumnTotal('interest'));
    }
    const getTotal = () => {
        return formatCurrency(getColumnTotal('total'));
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
                    {props.repayments.map((repayment: IRepayment) =>
                        (<tr key={repayment.dateString}>
                            <td>{repayment.dateString}</td>
                            <td>{formatCurrency(repayment.principal)}</td>
                            <td>{formatCurrency(repayment.interest)}</td>
                            <td>{formatCurrency(repayment.total)}</td>
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

const TableExamplePagination = () => (
    <Table celled>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Header</Table.HeaderCell>
                <Table.HeaderCell>Header</Table.HeaderCell>
                <Table.HeaderCell>Header</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>
            <Table.Row>
                <Table.Cell>
                    <Label ribbon>First</Label>
                </Table.Cell>
                <Table.Cell>Cell</Table.Cell>
                <Table.Cell>Cell</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Cell</Table.Cell>
                <Table.Cell>Cell</Table.Cell>
                <Table.Cell>Cell</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Cell</Table.Cell>
                <Table.Cell>Cell</Table.Cell>
                <Table.Cell>Cell</Table.Cell>
            </Table.Row>
        </Table.Body>

        <Table.Footer>
            <Table.Row>
                <Table.HeaderCell colSpan='3'>
                    <Menu floated='right' pagination>
                        <Menu.Item as='a' icon>
                            <Icon name='chevron left' />
                        </Menu.Item>
                        <Menu.Item as='a'>1</Menu.Item>
                        <Menu.Item as='a'>2</Menu.Item>
                        <Menu.Item as='a'>3</Menu.Item>
                        <Menu.Item as='a'>4</Menu.Item>
                        <Menu.Item as='a' icon>
                            <Icon name='chevron right' />
                        </Menu.Item>
                    </Menu>
                </Table.HeaderCell>
            </Table.Row>
        </Table.Footer>
    </Table>
)

export default App;