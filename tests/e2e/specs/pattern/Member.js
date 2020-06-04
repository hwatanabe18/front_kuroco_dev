/// <reference types="cypress" />
// @ts-check

// https://docs.cypress.io/api/introduction/api.html

import { executeRequest, login } from '../../base';

const getMember = ({ memberId }) => {
  /** @type {import('../../../../generated/services/MembersService').MembersService.getMembersServiceRcmsApi1MembersMemberIdRequest} */
  const requestData = {
    memberId,
  };
  return executeRequest({
    cy,
    query: 'MembersService get member id',
    requestData,
  });
};

const shortExt = {
  radio: {key: '1', label: 'radioOption1'},
  selectbox: {key: '1',label: 'selectBoxOption1'},
  checkbox: [
    {key: '1', label: 'checkboxOption1'},
    {key: '3', label: 'checkboxOption3'},
  ],
  relation: {
    'module_type': 'topics',
    'module_id': 15
  },
};
const postInsertMemberShortExt = () => {
  /** @type {import('../../../../generated/services/MembersService').MembersService.postMembersServiceRcmsApi1MembersInsertRequest} */
  const requestData = {
    requestBody: {
      email: 'email+' + Date.now() + '@example.com',
      // login_id: string,
      login_pwd: 'qwer1234',
      nickname: 'TestMember',
      name1: 'Test',
      name2: 'Member',
      text: 'string',
      radio: '1',
      selectbox: '1',
      checkbox: ['1', '3'],
      relation: 15,
      open_flg: 1,
      login_ok_flg: 0,
      validate_only: false,
    },
  };
  return executeRequest({
    cy,
    query: 'MembersService post insert',
    requestData,
  });
};

const postInsertMember = () => {
  /** @type {import('../../../../generated/services/MembersService').MembersService.postMembersServiceRcmsApi1MembersInsertRequest} */
  const requestData = {
    requestBody: {
      email: 'email+' + Date.now() + '@example.com',
      login_id: Date.now() + '',
      login_pwd: 'qwer1234',
      nickname: 'TestMember',
      name1: 'Test',
      name2: 'Member',
      sex: 'm',
      birth: '1990-01-01',
      // member_photo: {
      //     file_id: 'test.png',
      //     file_nm: 'test',
      //     desc: 'desc',
      // },
      text: 'string',
      textarea: 'string\nstring',
      radio: {key: '1', label: 'radioOption1'},
      selectbox: {key: '1',label: 'selectBoxOption1'},
      checkbox: [
        {key: '1', label: 'checkboxOption1'},
        {key: '3', label: 'checkboxOption3'},
      ],
      date: '2020-06-01',
      // relation: {
      //   'module_type': 'topics',
      //   'module_id': 15
      // },
      // file: {
      //   file_id: 'file.png',
      //   file_nm: 'file',
      //   desc: 'File',
      // },
      open_flg: 1,
      login_ok_flg: 0,
      validate_only: false,
    },
  };
  return executeRequest({
    cy,
    query: 'MembersService post insert',
    requestData,
  });
};

const postUpdateMemberEmpty = ({ memberId }) => {
  /** @type {import('../../../../generated/services/MembersService').MembersService.postMembersServiceRcmsApi1MembersUpdateRequest} */
  const requestData = {
    requestBody: {
      member_id: memberId,
      login_id: '',
      name1: '',
      name2: '',
      // sex: '',
      // birth: '',
      // member_photo: {},
      textarea: '',
      radio: '',
      selectbox: '',
      checkbox: [],
      date: '',
      relation: '',
      // file: {},
      validate_only: false,
    },
  };
  return executeRequest({
    cy,
    query: 'MembersService post update',
    indexOfApis: 0,
    requestData,
  });
};

const postUpdateMemberNoChange = ({ memberId }) => {
  /** @type {import('../../../../generated/services/MembersService').MembersService.postMembersServiceRcmsApi1MembersUpdateRequest} */
  const requestData = {
    requestBody: {
      member_id: memberId,
      validate_only: false,
    },
  };
  return executeRequest({
    cy,
    query: 'MembersService post update',
    indexOfApis: 0,
    requestData,
  });
};

const postDeleteMember = ({ memberId }) => {
  /** @type {import('../../../../generated/services/MembersService').MembersService.postMembersServiceRcmsApi1MembersDeleteRequest} */
  const requestData = {
    requestBody: {
      member_id: memberId,
    },
  };
  return executeRequest({
    cy,
    query: 'MembersService post delete',
    indexOfApis: 0,
    requestData,
  });
};

describe('Member pattern', () => {
  it(`
      post insert member with short ext ->
      get member by ID of inserted one ->
      post delete updated member
  `, async () => {
    login();
    // post insert member with short ext
    const insertRes = await postInsertMemberShortExt();
    const addedId = insertRes.id;
    // get member by ID of inserted one
    const insertedMember = await getMember({ memberId: addedId });

    Object.keys(shortExt).forEach(key => {
      expect(insertedMember.details[key]).to.deep.equal(shortExt[key]);
    });

    // post delete updated member
    const deleteRes = await postDeleteMember({ memberId: addedId });

  });

  it(`
      post insert member ->
      get member by ID of inserted one ->
      post update inserted member (no changes) ->
      get member by ID of updated one ->
      compare inserted member and updated member ->
      post delete updated member
  `, async () => {
    login();
    
    // post insert member
    const insertRes = await postInsertMember();
    const addedId = insertRes.id;

    // get member by ID of inserted one
    let insertedMember = await getMember({ memberId: addedId });
    delete insertedMember.details.update_ymdhi;

    // post update inserted member (no changes)
    await postUpdateMemberNoChange({ memberId: addedId });

    // get member by ID of updated one
    let updatedMember = await getMember({ memberId: addedId });
    delete updatedMember.details.update_ymdhi;

    // compare inserted member and updated member
    // TODO: 未検証
    expect(updatedMember.details).to.deep.equal(insertedMember.details);

    // post delete updated member
    const deleteRes = await postDeleteMember({ memberId: addedId });

  });

  it(`
      post insert member ->
      get member by ID of inserted one ->
      post update inserted member with empty values ->
      get member by ID of updated one

  `, async () => {
    login();
    
    // post insert member
    const insertRes = await postInsertMember();
    const addedId = insertRes.id;

    // get member by ID of inserted one
    const insertedMember = await getMember({ memberId: addedId });

    expect(insertedMember.details.login_id).to.not.be.empty;
    expect(insertedMember.details.name1).to.not.be.empty;
    expect(insertedMember.details.name2).to.not.be.empty;
    expect(insertedMember.details.sex).to.not.be.empty;
    expect(insertedMember.details.birth).to.not.be.empty;
    expect(insertedMember.details.textarea).to.not.be.empty;
    expect(insertedMember.details.radio).to.not.be.empty;
    expect(insertedMember.details.selectbox).to.not.be.empty;
    expect(insertedMember.details.checkbox).to.not.be.empty;
    expect(insertedMember.details.relation).to.not.be.empty;

    // post update inserted member with empty values
    await postUpdateMemberEmpty({ memberId: addedId });

    // get member by ID of updated one
    const updatedMember = await getMember({ memberId: addedId });

    expect(updatedMember.details.login_id).to.be.empty;
    expect(updatedMember.details.name1).to.be.empty;
    expect(updatedMember.details.name2).to.be.empty;
    expect(updatedMember.details.sex).to.be.empty;
    expect(updatedMember.details.birth).to.be.empty;
    expect(updatedMember.details.textarea).to.be.empty;
    expect(updatedMember.details.radio).to.be.empty;
    expect(updatedMember.details.selectbox).to.be.empty;
    expect(updatedMember.details.checkbox).to.be.empty;
    expect(updatedMember.details.relation).to.be.empty;

  })

});
