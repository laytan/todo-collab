import { computed } from 'vue';
import { mapState } from '@/store';

/**
 * Watches the feathers-vuex state for isCreatePending, isGetPending and isFindPending
 * for the given services.
 *
 * @param {Array<String>} services services to watch
 * @returns ComputedRef<boolean>
 */
export default function useFeathersLoading(services) {
  const loadingStates = ['isCreatePending', 'isGetPending', 'isFindPending'];
  const vuexLoading = mapState(
    services.flatMap(
      (service) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        loadingStates.map((loadingState) => `${service}.${loadingState}`),
      // eslint-disable-next-line function-paren-newline
    ),
  );
  return computed(() => vuexLoading.filter((v) => v.value === true).length > 0);
}
