import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space
} from 'antd';


const { Option } = Select;


// ----------------------------------------------------------------------

export default function InstituteView() {

  const onFinish = (values) => {
    values.contact.phone_number = `${values.prefix}${values.contact.phone_number}`

    const newInstituteData = values;

    console.log('Received values of form: ', newInstituteData);

  };

  const [form] = Form.useForm();

  const theme = useTheme();

  const router = useRouter();


  const handleClick = () => {
    router.push('/dashboard');
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="+91">+91</Option>
        <Option value="+87">+87</Option>
      </Select>
    </Form.Item>
  );


  const OPTIONS = ['Computer Science', 'Maths', 'Physics', 'Chemistry'];
  const [selectedItems, setSelectedItems] = useState([]);
  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));


  const validateWebsite = (rule, value) => {
    // Regular expression to check if the value is a valid URL
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

    if (!value || urlRegex.test(value)) {
      return Promise.resolve();
    }

    return Promise.reject(new Error('Please enter a valid website URL'));
  };

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  const renderForm = (
    <>
      <Stack spacing={3} alignItems="center" justifyContent="center">


        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            prefix: +91,
          }}
          style={{
            maxWidth: 600,
          }}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label="Institute Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='E-mail'
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="ConfirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new password that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />

          </Form.Item>

          <Form.Item
            label="Street"
            name={['address', 'street']}
            rules={[{ required: true, message: 'Please input the street address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="City"
            name={['address', 'city']}
            rules={[{ required: true, message: 'Please input the city!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="State"
            name={['address', 'state']}
            rules={[{ required: true, message: 'Please input the state!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="ZIP"
            name={['address', 'zip']}
            rules={[{ required: true, message: 'Please input the ZIP code!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Country"
            name={['address', 'country']}
            rules={[{ required: true, message: 'Please select the country!' }]}
          >
            <Select>
              {/* Add your list of countries as Options */}
              <Option value="India">India</Option>
              {/* <Option value="Country2">Country2</Option> */}
              {/* Add more countries as needed */}
            </Select>
          </Form.Item>

          <Form.Item
            name={['contact', 'phone_number']}
            label="Phone Number"
            rules={[
              {
                required: true,
                message: 'Please input your phone number!',
              },
            ]}
          >
            <Input
              addonBefore={prefixSelector}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>

          <Form.Item
            name={['contact', 'website']}
            label="Website "
            rules={[

              {
                required: true,
                message: 'Please input your website!'
              },
              { validator: validateWebsite },

            ]}
          >
            <Input
              style={{
                width: '100%',
              }}
            />
          </Form.Item>

          <Form.Item
            name='Department'
            label="Department"
            rules={[
              {
                required: true,
                message: 'Please input available departments'
              },
            ]}
          >

            <Select
              mode="multiple"
              placeholder="Select Departments"
              value={selectedItems}
              onChange={setSelectedItems}
              style={{
                width: '100%',
              }}
              options={filteredOptions.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Form.Item>

          <Form.Item
            style={{
              position: "relative",
              right: -65
            }}>
            <LoadingButton
              display="Flex"
              alignItems="center"
              justifyContent="center"
              type="primary"
              htmlType="submit"
              fullWidth
              size="large"
              // type="submit"
              variant="contained"
              color="inherit"
            // onClick={handleClick}
            >
              Register
            </LoadingButton>

          </Form.Item>
        </Form >
      </Stack>

    </>

  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      {/* <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      /> */}

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 600,
            overflowY: 'visible'
          }}
        >
          <Typography variant="h4">Institute Sign Up</Typography>

          {/* <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link>
          </Typography> */}

          {/* <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button> */}
          {/* </Stack> */}

          <Divider sx={{ my: 3 }}>
            {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography> */}
          </Divider>

          {renderForm}
        </Card>
      </Stack >
    </Box >
  );
}
