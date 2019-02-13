import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import * as config from '@/shared/config/config';
import UserManagementEdit from '@/admin/user-management/user-management-edit.vue';
import UserManagementEditClass from '@/admin/user-management/user-management-edit.component';
import UserManagementService from '@/admin/user-management/user-management.service';

const localVue = createLocalVue();
const mockedAxios: any = axios;

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', FontAwesomeIcon);

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn()
}));

describe('UserManagementEdit Component', () => {
  let wrapper: Wrapper<UserManagementEditClass>;
  let userManagementEdit: UserManagementEditClass;

  beforeEach(() => {
    wrapper = shallowMount<UserManagementEditClass>(UserManagementEdit, {
      store,
      i18n,
      localVue,
      provide: { userService: () => new UserManagementService() }
    });
    userManagementEdit = wrapper.vm;
  });

  it('should be a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  describe('init', () => {
    it('Should load user', async () => {
      // GIVEN
      mockedAxios.get.mockReturnValue(Promise.resolve({}));

      // WHEN
      userManagementEdit.init(1);
      await userManagementEdit.$nextTick();

      // THEN
      expect(mockedAxios.get).toHaveBeenCalledWith(`api/users/1`);
    });
  });

  describe('initAuthorities', () => {
    it('Should load authorities', async () => {
      // GIVEN
      mockedAxios.get.mockReturnValue(Promise.resolve({}));

      // WHEN
      userManagementEdit.initAuthorities();
      await userManagementEdit.$nextTick();

      // THEN
      expect(mockedAxios.get).toHaveBeenCalledWith(`api/users/authorities`);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing user', async () => {
      // GIVEN
      mockedAxios.put.mockReturnValue(Promise.resolve({}));
      userManagementEdit.userAccount = { id: 1, authorities: [] };

      // WHEN
      userManagementEdit.save();
      await userManagementEdit.$nextTick();

      // THEN
      expect(mockedAxios.put).toHaveBeenCalledWith(`api/users`, { id: 1, authorities: [] });
      expect(userManagementEdit.isSaving).toEqual(false);
    });

    it('Should call create service on save for new user', async () => {
      // GIVEN
      mockedAxios.post.mockReturnValue(Promise.resolve({}));
      userManagementEdit.userAccount = { authorities: [] };

      // WHEN
      userManagementEdit.save();
      await userManagementEdit.$nextTick();

      // THEN
      expect(mockedAxios.post).toHaveBeenCalledWith(`api/users`, { authorities: [] });
      expect(userManagementEdit.isSaving).toEqual(false);
    });
  });
});
