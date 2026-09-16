// User Roles
const ROLES = {
  ADMIN: 'admin',
  TEAM: 'team',
  INSTRUCTOR: 'instructor',
  PREMIUM: 'premium',
  FREE: 'free'
};

// Team Roles
const TEAM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  CONTENT_MANAGER: 'content_manager',
  COMMUNITY_MANAGER: 'community_manager',
  EVENT_MANAGER: 'event_manager'
};

// Permissions
const PERMISSIONS = {
  // Content Management
  CREATE_COURSE: 'create_course',
  EDIT_COURSE: 'edit_course',
  DELETE_COURSE: 'delete_course',
  CREATE_BLOG: 'create_blog',
  EDIT_BLOG: 'edit_blog',
  DELETE_BLOG: 'delete_blog',
  CREATE_LAB: 'create_lab',
  EDIT_LAB: 'edit_lab',
  DELETE_LAB: 'delete_lab',
  CREATE_LEARNING_PATH: 'create_learning_path',
  EDIT_LEARNING_PATH: 'edit_learning_path',
  DELETE_LEARNING_PATH: 'delete_learning_path',
  
  // User Management
  VIEW_USERS: 'view_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  MANAGE_ROLES: 'manage_roles',
  
  // Community Management
  MANAGE_COMMUNITY: 'manage_community',
  MANAGE_EVENTS: 'manage_events',
  MANAGE_SPONSORS: 'manage_sponsors',
  
  // System Management
  MANAGE_BANNERS: 'manage_banners',
  MANAGE_SWAG: 'manage_swag',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SETTINGS: 'manage_settings'
};

// Role-based permissions mapping
const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  team: {
    super_admin: Object.values(PERMISSIONS),
    content_manager: [
      PERMISSIONS.CREATE_COURSE,
      PERMISSIONS.EDIT_COURSE,
      PERMISSIONS.DELETE_COURSE,
      PERMISSIONS.CREATE_BLOG,
      PERMISSIONS.EDIT_BLOG,
      PERMISSIONS.DELETE_BLOG,
      PERMISSIONS.CREATE_LAB,
      PERMISSIONS.EDIT_LAB,
      PERMISSIONS.DELETE_LAB,
      PERMISSIONS.CREATE_LEARNING_PATH,
      PERMISSIONS.EDIT_LEARNING_PATH,
      PERMISSIONS.DELETE_LEARNING_PATH
    ],
    community_manager: [
      PERMISSIONS.MANAGE_COMMUNITY,
      PERMISSIONS.MANAGE_EVENTS,
      PERMISSIONS.MANAGE_SPONSORS,
      PERMISSIONS.VIEW_USERS
    ],
    event_manager: [
      PERMISSIONS.MANAGE_EVENTS,
      PERMISSIONS.VIEW_USERS
    ]
  },
  instructor: [
    PERMISSIONS.CREATE_COURSE,
    PERMISSIONS.EDIT_COURSE,
    PERMISSIONS.CREATE_BLOG,
    PERMISSIONS.EDIT_BLOG,
    PERMISSIONS.CREATE_LAB,
    PERMISSIONS.EDIT_LAB
  ],
  premium: [],
  free: []
};

module.exports = {
  ROLES,
  TEAM_ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS
};