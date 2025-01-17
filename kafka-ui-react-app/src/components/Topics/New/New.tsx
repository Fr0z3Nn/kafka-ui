import React from 'react';
import { TopicFormData } from 'redux/interfaces';
import { useForm, FormProvider } from 'react-hook-form';
import { ClusterNameRoute } from 'lib/paths';
import TopicForm from 'components/Topics/shared/Form/TopicForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { createTopic } from 'redux/reducers/topics/topicsSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { topicFormValidationSchema } from 'lib/yupExtended';
import PageHeading from 'components/common/PageHeading/PageHeading';
import { useAppDispatch } from 'lib/hooks/redux';
import useAppParams from 'lib/hooks/useAppParams';
import { AsyncRequestStatus } from 'lib/constants';

enum Filters {
  NAME = 'name',
  PARTITION_COUNT = 'partitionCount',
  REPLICATION_FACTOR = 'replicationFactor',
  INSYNC_REPLICAS = 'inSyncReplicas',
  CLEANUP_POLICY = 'Delete',
}

const New: React.FC = () => {
  const methods = useForm<TopicFormData>({
    mode: 'onChange',
    resolver: yupResolver(topicFormValidationSchema),
  });

  const { clusterName } = useAppParams<ClusterNameRoute>();
  const navigate = useNavigate();

  const { search } = useLocation();
  const dispatch = useAppDispatch();
  const params = new URLSearchParams(search);

  const name = params.get(Filters.NAME) || '';
  const partitionCount = params.get(Filters.PARTITION_COUNT) || 1;
  const replicationFactor = params.get(Filters.REPLICATION_FACTOR) || 1;
  const inSyncReplicas = params.get(Filters.INSYNC_REPLICAS) || 1;
  const cleanUpPolicy = params.get(Filters.CLEANUP_POLICY) || 'Delete';

  const onSubmit = async (data: TopicFormData) => {
    const { meta } = await dispatch(createTopic({ clusterName, data }));

    if (meta.requestStatus === AsyncRequestStatus.fulfilled) {
      navigate(`../${data.name}`);
    }
  };

  return (
    <>
      <PageHeading text={search ? 'Copy Topic' : 'Create new Topic'} />
      <FormProvider {...methods}>
        <TopicForm
          topicName={name}
          cleanUpPolicy={cleanUpPolicy}
          partitionCount={Number(partitionCount)}
          replicationFactor={Number(replicationFactor)}
          inSyncReplicas={Number(inSyncReplicas)}
          isSubmitting={methods.formState.isSubmitting}
          onSubmit={methods.handleSubmit(onSubmit)}
        />
      </FormProvider>
    </>
  );
};

export default New;
