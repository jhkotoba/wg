const repo = require(`${basePath}/config/repository.js`);


/**
 * 회원정보 조회
 * @param {string} userId 
 * @returns 
 */
exports.selectUser = async (userId, conn) => {
    
    // 회원정보 조회 쿼리
    return await repo.selectOne(
        `/* userRepository.selectUser */
        SELECT
            USER_NO     AS userNo
            , USER_ID   AS userId
            , PASSWORD  AS password
            , SALT      AS salt
            , EMAIL     AS email
            , AUTH_CD   AS authCd
        FROM UR_USER
        WHERE 1=1
        AND USER_ID = '${userId}'
        LIMIT 1`, conn);
}

/**
 * 사용자 목록 카운트 조회
 * @param {*} params 
 * @param {*} conn 
 */
exports.selectUserCount = async(params, conn) => {

    let searchWord = '';
    switch(params?.srhType){
        case 'userNo':
            searchWord = `AND USER_NO = '${params.srhWord}'`;
            break;
        case 'userId':
            searchWord = `AND USER_ID = '${params.srhWord}'`;
            break;
    }

    return await repo.selectOne(`/* userRepository.selectUserCount */ 
        SELECT COUNT(1) AS totalCount FROM UR_USER
        WHERE 1=1
        ${params?.srhWord ? searchWord : ' '}
        ${params?.auth ? " AND AUTH_CD = " + repo.string(params.auth) : ' '}
        `, conn);
}

/**
 * 사용자 목록 조회
 * @param {*} params 
 * @param {*} conn 
 */
exports.selectUserList = async (params, conn) => {

    let searchWord = '';
    switch(params?.srhType){
        case 'userNo':
            searchWord = `AND USER_NO = '${params.srhWord}'`;
            break;
        case 'userId':
            searchWord = `AND USER_ID = '${params.srhWord}'`;
            break;
    }
    
    return await repo.selectList(
        `/* userRepository.selectUserList */
        SELECT
            USER_NO     AS userNo
            , USER_ID   AS userId
            , EMAIL     AS email
            , AUTH_CD   AS authCd
            , USE_YN    AS useYn
            , DATE_FORMAT(INS_DTTM, '%Y-%m-%d %H:%i:%S') AS insDttm
            , DATE_FORMAT(UPT_DTTM, '%Y-%m-%d %H:%i:%S') AS uptDttm
        FROM UR_USER
        WHERE 1=1
        ${params?.srhWord ? searchWord : ' '}
        ${params?.auth ? " AND AUTH_CD = " + repo.string(params.auth) : ' '}
        LIMIT ${(params.paging.pageNo - 1) * params.paging.pageSize}, ${params.paging.pageSize}`, conn);
}

/**
 * 회원등록
 * @param {*} user 
 * @returns 
 */
exports.insertUser = async (user, conn) => {

    // 회원등록
    return await repo.insert(
        `INSERT INTO UR_USER (
            USER_ID
            , PASSWORD
            , SALT
            , EMAIL
            , AUTH_CD
            , USE_YN
            , INS_NO
            , INS_DTTM
            , UPT_NO
            , UPT_DTTM
        ) VALUES (
            '${user.userId}'
            , '${user.password}'
            , '${user.salt}'
            , '${user.email}'
            , 'CD_AUTH_GUEST'
            , 'Y'
            , 0
            , NOW()
            , 0
            , NOW()
        )`
    , conn);
}
