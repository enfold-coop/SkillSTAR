import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import shortid from 'shortid';
import { useChainMasteryState } from '../../context/ChainMasteryProvider';
import { DataVerificationControlCallback } from '../../types/DataVerificationControlCallback';
import { Loading } from '../Loading/Loading';
import { DataVerificationListItem } from './DataVerificationListItem';

interface DataVerificationListProps {
  onChange: DataVerificationControlCallback;
}

const DataVerificationList = (props: DataVerificationListProps): JSX.Element => {
  const { onChange } = props;
  const chainMasteryState = useChainMasteryState();

  return chainMasteryState.chainMastery ? (
    <View style={styles.container}>
      <FlatList
        data={chainMasteryState.chainMastery.draftSession.step_attempts}
        renderItem={({ item }) => <DataVerificationListItem stepAttempt={item} onChange={onChange} />}
        keyExtractor={() => shortid()}
      />
    </View>
  ) : (
    <Loading />
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
