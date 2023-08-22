// version
import request from '@/utils/request'

const urls = {
  historyVersion: '/setting/version/historyVersion',                            // 历史版本信息 get
  versionPage: '/setting/version/list',                                         // 版本信息分页 post
  versionReleased: '/setting/version/released',                                 // 版本发布 post
  versionSave: '/setting/version/save',                                         // 添加版本信息 post
  versionInfo: '/setting/version/versionInfo',                                  // 获取版本信息 get
  listVersions: '/setting/version/listVersions',                                // 版本列表 get
  auditMarket: '/setting/version/auditMarket',                                  // 更新审核市场 post
  releasesHistory: '/setting/version/releasesHistory',                          // 可回退版本列表 get
  versionRecall: '/setting/version/recall',                                     // 版本回退 post
  versionEdit: '/setting/version/update',                                     // 版本编辑 post

  // for NFT Moudle
  NFThistoryVersion: '/nft/setting/version/historyVersion',                            // NFT历史版本信息 get
  NFTversionPage: '/nft/setting/version/list',                                         // NFT版本信息分页 post
  NFTversionReleased: '/nft/setting/version/released',                                 // NFT版本发布 post
  NFTversionSave: '/nft/setting/version/save',                                         // NFT添加版本信息 post
  NFTversionInfo: '/nft/setting/version/versionInfo',                                  // NFT获取版本信息 get
  NFTlistVersions: '/nft/setting/version/listVersions',                                // NFT版本列表 get
  NFTauditMarket: '/nft/setting/version/auditMarket',                                  // NFT更新审核市场 post
  NFTreleasesHistory: '/nft/setting/version/releasesHistory',                          // NFT可回退版本列表 get
  NFTversionRecall: '/nft/setting/version/recall',                                     // NFT版本回退 post
  NFTversionEdit: '/nft/setting/version/update',                                     // NFT版本编辑 post
}


export const historyVersion = data => request({url: urls.historyVersion, method: 'get', params: data});          // 历史版本信息
export const versionPage = data => request({url: urls.versionPage, method: 'post', data});                     // 版本信息分页
export const versionReleased = data => request({url: urls.versionReleased, method: 'post', data});             // 版本发布
export const versionSave = data => request({url: urls.versionSave, method: 'post', data});                     // 添加版本信息
export const versionInfo = data => request({url: urls.versionInfo, method: 'get', params: data});              // 获取版本信息
export const listVersions = data => request({url: urls.listVersions, method: 'get', params: data});              // 版本列表
export const auditMarket = data => request({url: urls.auditMarket, method: 'post', data});                     // 更新审核市场
export const releasesHistory = data => request({url: urls.releasesHistory, method: 'get', params: data});       // 可回退版本列表
export const versionRecall = data => request({url: urls.versionRecall, method: 'post', data});                  // 版本回退
export const versionEdit = data => request({url: urls.versionEdit, method: 'post', data});                  // 版本编辑

export const NFThistoryVersion = data => request({url: urls.NFThistoryVersion, method: 'get', params: data});          // NFT历史版本信息
export const NFTversionPage = data => request({url: urls.NFTversionPage, method: 'post', data});                     // NFT版本信息分页
export const NFTversionReleased = data => request({url: urls.NFTversionReleased, method: 'post', data});             // NFT版本发布
export const NFTversionSave = data => request({url: urls.NFTversionSave, method: 'post', data});                     // NFT添加版本信息
export const NFTversionInfo = data => request({url: urls.NFTversionInfo, method: 'get', params: data});              // NFT获取版本信息
export const NFTlistVersions = data => request({url: urls.NFTlistVersions, method: 'get', params: data});              // NFT版本列表
export const NFTauditMarket = data => request({url: urls.NFTauditMarket, method: 'post', data});                     // NFT更新审核市场
export const NFTreleasesHistory = data => request({url: urls.NFTreleasesHistory, method: 'get', params: data});       // NFT可回退版本列表
export const NFTversionRecall = data => request({url: urls.NFTversionRecall, method: 'post', data});                  // NFT版本回退
export const NFTversionEdit = data => request({url: urls.NFTversionEdit, method: 'post', data});                  // NFT版本编辑
