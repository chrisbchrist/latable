import Modals from "../src/modal/ModalContaner";
import {DomainEntity, Key, Keys} from "../src/domain/Domain";
import PersonForm from "./PersonForm";
import React from "react";
import DefaultClient, {gql} from "apollo-boost";

export interface Country extends DomainEntity {
    key: Key,
    name: string,
    currency: string,
    phone: string
};

export class CountrySupport {

     static columns = [{
        title: 'Code',
        dataIndex: 'key',
        key: 'key',
    }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency',
    }, {
        title: 'phone',
        dataIndex: 'phone',
        key: 'phone',
    }];

    static client = new DefaultClient({
        uri: 'https://countries.trevorblades.com/'
    });

    static query = gql`{
          countries {
            key: code
            name
            currency
            phone
          }
        }`;

    static async insertItem( country?: Country ): Promise<Country> {

        return new Promise<Country>( (resolve) => {

            // let newPerson = country ? {...country, key: uuid4(), firstName: country!.firstName + " +"} :
            //     {key: uuid4(), firstName: "Unknown", lastName: "Unknown", age: 0, profession: 'Unknown'};

            Modals.show(<PersonForm {...country}/>, {
                title: 'Insert Person',
                okText: 'Create',
                onOk: () =>  {
                    //TODO update data store
                    return resolve(country);
                },
                onCancel: () => resolve(undefined),
            })

        });
    }

    static updateItem( country: Country ): Promise<Country> {

        return new Promise<Country>( (resolve) => {

            // let updatedPerson = {...country, age: country.age + 10, firstName: country.firstName + " ^"};

            Modals.show( <PersonForm {...country} />,{
                title   : 'Update Person',
                okText  : 'Update',
                onOk    : () => {
                    //TODO update data store
                    return resolve(country);
                },
                onCancel: () => resolve(undefined),
            } )

        });

    }

    static confirmRemoval( countryIds: Keys ): Promise<boolean> {

        // let arr = countryIds.map(id => id);

        return Modals.confirm({
            title: `Delete ${countryIds.length > 1 ? countryIds.length : ""} selected ${countryIds.length > 1 ? 'items' : 'item'}?`,
            content: 'Some descriptions here',
            okType: 'primary',
            onOk: () => true,
            onCancel: () => false,
        }).then( (res) => {
                console.log("res", res);
                return res;
        }).catch(err => false)
    }

}

