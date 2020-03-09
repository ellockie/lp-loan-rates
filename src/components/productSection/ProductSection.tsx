import React, { ChangeEvent } from 'react';
import { Input, Message } from 'semantic-ui-react';

import { IRepayment, RepaymentsTable } from  '../repaymentsTable/RepaymentsTable';
import './productSection.css';


interface IProductSectionProps {
    title: string;
    productValid: boolean;
    repayments: IRepayment[];
    interestRate: number;
    onInterestChange(newRate: number): void;
}


export const ProductSection = (props: IProductSectionProps): JSX.Element => {

    const interestRateStep = 0.1;

    const onInterestRateChange = (ev: ChangeEvent<HTMLInputElement>): void => {
        props.onInterestChange(parseFloat(ev.target.value));
    };

    return (
        <div className='product'>
            <h2>{props.title}</h2>
            {props.productValid &&
                <>
                    <form onSubmit={(ev): void => ev.preventDefault()}>
                        <div>
                            <Input
                                type="number"
                                value={props.interestRate}
                                step={interestRateStep}
                                onChange={onInterestRateChange}
                                label='Interest rate'
                                size='mini'
                            />
                            &#37;
                        </div>
                    </form>
                    <RepaymentsTable repayments={props.repayments}></RepaymentsTable>
                </>
            }
            {!props.productValid &&
                <Message>
                    <Message.Header>Not available</Message.Header>
                    <p>
                    This product is not available for your<br/>combination of amount and/or duration
                    </p>
                </Message>
            }
        </div>
    );
};