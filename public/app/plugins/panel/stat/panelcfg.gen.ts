// Code generated - EDITING IS FUTILE. DO NOT EDIT.
//
// Generated by:
//     public/app/plugins/gen.go
// Using jennies:
//     TSTypesJenny
//     PluginTSTypesJenny
//
// Run 'make gen-cue' from repository root to regenerate.

import * as common from '@grafana/schema';

export const PanelCfgModelVersion = Object.freeze([0, 0]);

export interface PanelOptions extends common.SingleStatBaseOptions {
  colorMode: common.BigValueColorMode;
  graphMode: common.BigValueGraphMode;
  hasGradient?: boolean;
  justifyMode: common.BigValueJustifyMode;
  textMode: common.BigValueTextMode;
}

export const defaultPanelOptions: Partial<PanelOptions> = {
  colorMode: common.BigValueColorMode.Value,
  graphMode: common.BigValueGraphMode.Area,
  hasGradient: true,
  justifyMode: common.BigValueJustifyMode.Auto,
  textMode: common.BigValueTextMode.Auto,
};
