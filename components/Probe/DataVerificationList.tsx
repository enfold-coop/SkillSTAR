import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import shortid from 'shortid';
import { StepAttempt } from '../../types/chain/StepAttempt';
import { DataVerificationControlCallback } from '../../types/DataVerificationControlCallback';
import { DataVerificationListItem } from './DataVerificationListItem';

interface DataVerificationListProps {
  stepAttempts: StepAttempt[];
  onChange: DataVerificationControlCallback;
}

const DataVerificationList = (props: DataVerificationListProps): JSX.Element => {
  const { stepAttempts, onChange } = props;

  return (
    <View style={styles.container}>
      <FlatList
        data={stepAttempts}
        renderItem={({ item }) => <DataVerificationListItem stepAttempt={item} onChange={onChange} />}
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
