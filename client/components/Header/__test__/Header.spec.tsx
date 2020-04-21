import {shallow} from "enzyme";
import Header from "../Header";

import * as React from "react";

describe('components/Header', () => {

    test('Should render without crashing', () => {
        expect(shallow(<Header/>)).toExist();
    })

});
