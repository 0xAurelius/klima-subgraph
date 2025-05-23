import { CMARK_PROJECT_INFO } from '../../../lib/utils/CMARKProjectInfo'
import { ECO_REGISTRY_PROJECT_INFO } from '../../../lib/utils/EcoRegistryProjectInfo'
import { PURO_PROJECT_INFO } from '../../../lib/utils/PuroProjectInfo'
import { TVER_PROJECT_INFO } from '../../../lib/utils/TVERProjectInfo'
import { VERRA_PROJECT_NAMES } from '../../../lib/utils/VerraProjectInfo'

import { CarbonProject } from '../../generated/schema'

export function loadOrCreateCarbonProject(registry: string, projectID: string): CarbonProject {
  let project = CarbonProject.load(projectID)
  if (project == null) {
    project = new CarbonProject(projectID)
    project.registry = registry
    project.projectID = projectID
    project.name = ''
    project.methodologies = ''
    project.category = ''
    project.country = ''
    project.region = ''

    // Set known values for Verra projects
    if (registry == 'VERRA') {
      for (let i = 0; i < VERRA_PROJECT_NAMES.length; i++) {
        if (projectID == VERRA_PROJECT_NAMES[i][0]) {
          project.name = VERRA_PROJECT_NAMES[i][1]
          project.country = VERRA_PROJECT_NAMES[i][2]
          break
        }
      }
    }

    if (registry == 'PURO_EARTH') {
      for (let i = 0; i < PURO_PROJECT_INFO.length; i++) {
        if (projectID == PURO_PROJECT_INFO[i][0]) {
          project.name = PURO_PROJECT_INFO[i][1]
          project.country = PURO_PROJECT_INFO[i][2]
          break
        }
      }
    }

    if (registry == 'ECO_REGISTRY') {
      for (let i = 0; i < ECO_REGISTRY_PROJECT_INFO.length; i++) {
        if (projectID == ECO_REGISTRY_PROJECT_INFO[i][0]) {
          project.name = ECO_REGISTRY_PROJECT_INFO[i][1]
          project.country = ECO_REGISTRY_PROJECT_INFO[i][2]
          project.category = ECO_REGISTRY_PROJECT_INFO[i][4]
          break
        }
      }
    }

    if (registry == 'CMARK') {
      for (let i = 0; i < CMARK_PROJECT_INFO.length; i++) {
        let projectInfo = CMARK_PROJECT_INFO[i]
        if (projectID == projectInfo[0]) {
          project.name = projectInfo[1]
          project.methodologies = projectInfo[2]
          project.category = projectInfo[3]
          project.country = projectInfo[4]
          project.region = projectInfo[5]
        }
      }
    }

    if (registry == 'TVER') {
      for (let i = 0; i < TVER_PROJECT_INFO.length; i++) {
        let projectInfo = TVER_PROJECT_INFO[i]
        if (projectID == projectInfo[0]) {
          project.name = projectInfo[1]
          project.methodologies = projectInfo[2]
          project.category = projectInfo[3]
          project.country = projectInfo[4]
          project.region = projectInfo[5]
        }
      }
    }

    project.save()
  }
  return project as CarbonProject
}
