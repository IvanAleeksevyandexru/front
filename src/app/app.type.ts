import { Config } from '../../projects/epgu-constructor/src/app/config/config.types'

export interface ConfigEnv extends Config {}

export interface FormPlayerConfig {
  serviceId: string;
  targetId: string;
  orderId: string;
}

export interface AppConfig extends ConfigEnv, FormPlayerConfig  {

}
