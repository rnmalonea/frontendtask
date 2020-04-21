import * as enzyme from 'enzyme';
import 'jest-enzyme';

import ReactSixteenAdapter from 'enzyme-adapter-react-16';

declare var global: any;

global.define = (a: any) => a;
global.document = {};

enzyme.configure({adapter: new ReactSixteenAdapter()});
