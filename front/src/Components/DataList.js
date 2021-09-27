import React from 'react';
import { FlatList, SectionList, Text, View } from 'react-native';
import styled from 'styled-components/native';
import {
    BLUE,
    CYAN,
    DARK_BLUE,
    DARK_CYAN,
    GRAY_45,
    GRAY_8,
    PETROL,
    PRIMARY_BLUE,
} from '../Config';
import ListItem from './ListItem';

const SectionHeaderTextWrap = styled.View`
  background-color: ${GRAY_8};
  margin-top: 4px;
  margin-bottom: 4px;
  padding-vertical: 4px;
  padding-horizontal: 4px;
`;

const HeaderText = styled.Text`
  color: ${GRAY_45};
  font-weight: 700;
`;

const ListView = styled.View`
  background-color: white;
`;

const CustomList = styled.FlatList`
`;

const SectionHeader = ({ text, additionalText }) => {
    return (
        <SectionHeaderTextWrap>
            <HeaderText>{text}</HeaderText>
        </SectionHeaderTextWrap>
    );
};

const DataList = ({ data, renderItem, sections = false, cards = false }) => {
    let _data = data;
    const onPress = e => {
        console.log('pressed');
    };
    const _renderItem = ({ item }) => {
        console.log('item to render', item);
        return <ListItem onPress={item.archived ? onPress : onPress} item={item} />;
    };
    const _renderSectionHeader = ({ section }) => {
        console.log('section', section);
        const title = 'title';
        return <SectionHeader text={section.title} additionalText="lisäteksti" />;
    };
    if (sections) {
        console.log('arranging for sections');
        const sectionList = [];
        const sectionedData = data.map(item => {
            return { title: item.title[0], data: item };
        });
        console.log('sectioned', sectionedData);
        if (sectionedData && sectionedData.length > 0) {
            const grouped = new Map();
            sectionedData.forEach(item => {
                const sectionKey = item.title[0];
                if (!grouped.has(sectionKey)) {
                    grouped.set(sectionKey, [item.data]);
                } else {
                    grouped.set(sectionKey, [...grouped.get(sectionKey), item.data]);
                }
            });
            const groupedArray = Array.from(grouped, ([title, value]) => ({
                title: title,
                data: value,
            }));
            console.log(groupedArray);
            _data = groupedArray;
        }
    }

    return (
        <ListView>
            {sections ? (
                <SectionList
                    sections={_data}
                    renderSectionHeader={_renderSectionHeader}
                    renderItem={_renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <CustomList
                    cards={cards}
                    numColumns={cards?2:1}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </ListView>
    );
};

export default DataList;
