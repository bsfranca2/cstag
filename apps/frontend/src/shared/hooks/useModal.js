import { ModalForm as AntModalForm } from '@ant-design/pro-form';
import { Form } from 'antd';
import { useState } from 'react';
import DisplayErrors from '../components/DisplayErrors';

const getPropValue = (prop, resourceName, resourceData) => {
  if (typeof prop === 'function') {
    return prop({ [resourceName]: resourceData });
  }
  return prop;
};

/**
 * @typedef {Object} FormFields
 * @property {import('antd').FormInstance} form
 */

/**
 * @param {Object} props
 * @param {string|() => string} props.title
 * @param {JSX.Element} props.trigger
 * @param {(args: FormFields) => []} props.formFields
 * @param {import('react-query').UseMutationResult} props.mutation
 */
export function useModalForm(props) {
  const { title, formFields, mutation } = props;

  const [form] = Form.useForm();

  const closeModal = () => {
    mutation.reset();
    form.resetFields();
  };

  return (
    <AntModalForm
      title={title}
      trigger={props.trigger}
      onFinish={async (values) => {
        await mutation.mutateAsync(values);
        closeModal();
        return true;
      }}
      modalProps={{
        onCancel: closeModal,
      }}
      form={form}
      submitter={{
        submitButtonProps: {
          loading: mutation.isLoading,
        },
        resetButtonProps: {
          disabled: mutation.isLoading,
        },
      }}
      width={512}
    >
      <DisplayErrors {...mutation} />
      {formFields({ form }).map((field) => field)}
    </AntModalForm>
  );
}

/**
 * @param {Object} props
 * @param {string} props.resourceName
 * @param {string|() => string} props.title
 * @param {() => Promise<void>|null} props.onInit
 * @param {() => []} props.formFields
 * @param {import('react-query').UseMutationResult} props.mutation
 */
export function useModalFormEdit(props) {
  const { resourceName, title, formFields, mutation } = props;

  const [state, setState] = useState({
    visible: false,
    resource: {},
  });
  const [form] = Form.useForm();

  const openModal = (data) => {
    setState({
      visible: true,
      resource: data,
    });
  };

  const closeModal = () => {
    mutation.reset();
    form.resetFields();
    setState({
      visible: false,
      resource: {},
    });
  };

  const modalForm = state.visible ? (
    <AntModalForm
      title={getPropValue(title, resourceName, state.resource)}
      visible={true}
      onInit={() => {
        try {
          if (props.onInit)
            props.onInit({ [resourceName]: state.resource, form });
        } catch (err) {
          console.error(err);
        }
      }}
      onFinish={async (values) => {
        await mutation.mutateAsync(values);
        closeModal();
      }}
      modalProps={{
        onCancel: closeModal,
      }}
      form={form}
      submitter={{
        submitButtonProps: {
          loading: mutation.isLoading,
        },
        resetButtonProps: {
          disabled: mutation.isLoading,
        },
      }}
      width={512}
    >
      <DisplayErrors {...mutation} />
      {formFields({ [resourceName]: state.resource, form }).map(
        (field) => field
      )}
    </AntModalForm>
  ) : null;

  return {
    modalForm,
    openModal,
  };
}
