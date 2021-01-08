import React, { FC } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import shortid from 'shortid';
import { StepAttempt } from '../../types/CHAIN/StepAttempt';
import { ListItemSwitchCallback } from '../../types/ListItemSwitchCallback';
import { DataVerificationListItem } from './DataVerificationListItem';

type Props = {
  stepAttempts: StepAttempt[];
  onChange: ListItemSwitchCallback;
};

const DataVerificationList: FC<Props> = props => {
  const { stepAttempts, onChange } = props;

  return (
    <View style={styles.container}>
      <FlatList
        data={stepAttempts}
        renderItem={({ item }) => <DataVerificationListItem stepAttempt={item} onChange={onChange}/>}
        keyExtractor={() => shortid()}
      />
    </View>
  );
};

export default DataVerificationList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // paddingBottom: 20,
  },
});
