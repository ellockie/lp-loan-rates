import React, { ChangeEvent } from 'react';

import { IRepayment, RepaymentsTable } from  './RepaymentsTable';


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
                                min='0'
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
    );
};