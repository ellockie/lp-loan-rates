import React, { ChangeEvent } from 'react';
import { Input, Message } from 'semantic-ui-react';

import { IRepayment, RepaymentsTable } from  './RepaymentsTable';
import './productSection.css';


interface IProductSectionProps {
    title: string;
    productValid: boolean;
    repayments: IRepayment[];
    interestRate: number;
    onInterestChange(newRate: number): void;
}


export const ProductSection = (props: IProductSectionProps): JSX.Element => {
    const { productValid, repayments, interestRate } = props;
    const onInterestRateChange = (ev: ChangeEvent<HTMLInputElement>): void => {
        props.onInterestChange(parseInt(ev.target.value));
    };

    return (
        <div className='product'>
            <h2>{props.title}</h2>
            {productValid &&
                <>
                    <form onSubmit={(ev): void => ev.preventDefault()}>
                        <div>
                            <Input
                                type="number"
                                value={interestRate}
                                min='0'
                                onChange={onInterestRateChange}
                                label='Interest rate'
                                size='mini'
                            />
                            &#37;
                        </div>
                    </form>
                    <RepaymentsTable repayments={repayments}></RepaymentsTable>
                </>
            }
            {!productValid &&
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