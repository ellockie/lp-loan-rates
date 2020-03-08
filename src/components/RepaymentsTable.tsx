import React from 'react';


export interface IRepayment {
    dateString: string;
    principal: number;
    interest: number;
    total: number;
}

interface IRepaymentsTableProps {
    repayments: IRepayment[];
}

type RepaymentField = 'principal' | 'interest' | 'total';


export const RepaymentsTable = (props: IRepaymentsTableProps): JSX.Element => {

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
    }

    const getColumnTotal = (fieldName: RepaymentField): number => {
        return props.repayments
            .reduce((sum: number, repayment: IRepayment) => sum + repayment[fieldName], 0)
    }

    const getPrincipalTotal = (): string => {
        return formatCurrency(getColumnTotal('principal'));
    }
    const getInterestTotal = (): string => {
        return formatCurrency(getColumnTotal('interest'));
    }
    const getTotal = (): string => {
        return formatCurrency(getColumnTotal('total'))
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