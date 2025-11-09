import { User, UserRole } from "./getUser"
import { murmurhash } from "./murmurhash"

export type FeatureFlagName = keyof typeof FEATURE_FLAGS

type FeatureFlagRule = {
  percentageOfUsers?: number
  userRoles?: UserRole[]
} & (
  | {
      percentageOfUsers: number
    }
  | { userRoles: UserRole[] }
)

export const FEATURE_FLAGS = {
  REWARD_POINT_SYSTEM: false,
  BUSINESS_ANALYTICS: false,
  GST_PAYMENTS: false,
  CREDIT_CARD_MANAGEMENT: false,
  BILLER_PAYMENTS: false,
  ALLOWED_FIELDS: true,
  REFERRAL_SYSTEM: false,
  ERP_INTEGRATION: false,
  TWOFA_AUTHENTICATION: false,
  AUTHORIZED_DEVICES: false,
  PAYMENT_CALENDAR_ADVANCED: false,
  PAYMENT_METHOD_CARD: true,
  PAYMENT_METHOD_BANK: false,
  PAYMENT_METHOD_BNPL: false,
  PAYMENT_METHOD_UPI: false,
  MULTIPLE_ALLOWANCES: [
    { userRoles: ["developer", "owner"] },
  ],
} as const satisfies Record<string, FeatureFlagRule[] | boolean>
    // { percentageOfUsers: 0.25, userRoles: ["user"] },  // will add this if need to do A/B testing

export function canViewFeature(featureName: FeatureFlagName, user: User) {
  const rules = FEATURE_FLAGS[featureName]
  if (typeof rules === "boolean") return rules
  return rules.some(rule => checkRule(rule, featureName, user))
}

function checkRule(
  { userRoles, percentageOfUsers }: FeatureFlagRule,
  featureName: FeatureFlagName,
  user: User
) {
  return (
    userHasValidRole(userRoles, user.role) &&
    userIsWithinPercentage(featureName, percentageOfUsers, user.id)
  )
}

function userHasValidRole(
  allowedRoles: UserRole[] | undefined,
  userRole: UserRole
) {
  return allowedRoles == null || allowedRoles.includes(userRole)
}

const MAX_UINT_32 = 4294967295
function userIsWithinPercentage(
  featureName: FeatureFlagName,
  allowedPercent: number | undefined,
  flagId: string
) {
  if (allowedPercent == null) return true

  return murmurhash(`${featureName}-${flagId}`) / MAX_UINT_32 < allowedPercent
}