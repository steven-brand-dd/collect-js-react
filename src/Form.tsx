import React from 'react';
import { setFormInstance, getFormInstance } from './state';
import { IVGSCollectForm, VGSCollectFormState, ICollectFormProps } from './types/Form';

import {
  TextField,
  CardNumberField,
  CardExpirationDateField,
  CardSecurityCodeField,
  PasswordField,
  SSNField,
  ZipCodeField,
  TextareaField,
  NumberField,
} from './Fields';

export const VGSCollectForm = (props: ICollectFormProps) => {
  const {
    vaultId,
    environment = 'sandbox',
    action = '/',
    cname,
    submitParameters,
    tokenizationAPI = false,
    onUpdateCallback,
    onSubmitCallback,
    children
  } = props;

  if (
    typeof window !== 'undefined' &&
    window.VGSCollect &&
    Object.keys(getFormInstance()).length === 0
  ) {
    const form: IVGSCollectForm = window.VGSCollect.create(vaultId, environment, (state: VGSCollectFormState) => {
      if (onUpdateCallback) {
        onUpdateCallback(state);
      }
    });

    if (cname) {
      form.useCname(cname);
    }

    setFormInstance(form);
  }

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const form: IVGSCollectForm = getFormInstance();
    
    if (!form) {
      throw new Error('@vgs/collect-js-react: VGS Collect form not found.')
    }
    
    if (tokenizationAPI) {
      form.tokenize(
        (status: any, resp: any) => {
          if (onSubmitCallback) {
            onSubmitCallback(status, resp);
          }
        },
        (errors: any) => {
          throw new Error('@vgs/collect-js-react: Something went wrong. Please, contact a support@verygoodsecurity.com')
        }
      );
    } else {
      form.submit(action, submitParameters, (status: any, resp: any) => {
        if (onSubmitCallback) {
          onSubmitCallback(status, resp);
        }
      });
    }
  }

  return (
    <form onSubmit={(event) => { submitHandler(event) }}>
      {children}
    </form>
  )
}

VGSCollectForm.TextField = TextField;
VGSCollectForm.CardNumberField = CardNumberField;
VGSCollectForm.CardExpirationDateField = CardExpirationDateField;
VGSCollectForm.CardSecurityCodeField = CardSecurityCodeField;
VGSCollectForm.PasswordField = PasswordField;
VGSCollectForm.SSNField = SSNField;
VGSCollectForm.ZipCodeField = ZipCodeField;
VGSCollectForm.TextareaField = TextareaField;
VGSCollectForm.NumberField = NumberField;
