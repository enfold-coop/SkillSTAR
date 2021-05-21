import { cleanup } from '@testing-library/react-native';

global.afterEach(cleanup);
global.fetch = require('jest-fetch-mock');
