export const DASHBOARD_DATA = {
  location: {
    totalLocations: 4,
    gmbLocations: 2,
    metaLocations: 2,
    micrositeLocations: 2,
    auditScore: 40,
  },
  campaign: {
    summary: {
      totalSpends: 10000,
      impressions: 10000,
      totalCampaigns: 10,
      activeCampaigns: 1,
    },
    spends: [
      {
        month: 'Jan',
        value: 450,
      },
      {
        month: 'Feb',
        value: 300,
      },
      {
        month: 'Mar',
        value: 250,
      },
      {
        month: 'Apr',
        value: 500,
      },
      {
        month: 'May',
        value: 740,
      },
      {
        month: 'Jun',
        value: 666,
      },
      {
        month: 'Jul',
        value: 329,
      },
      {
        month: 'Aug',
        value: 878,
      },
      {
        month: 'Sep',
        value: 567,
      },
      {
        month: 'Oct',
        value: 945,
      },
      {
        month: 'Nov',
        value: 583,
      },
      {
        month: 'Dec',
        value: 787,
      },
    ],
  },
  review: {
    reviewSummary: {
      totalReviews: 100,
      avRating: 10,
      nps: 3,
    },
    topReviewLocations: [
      {
        locationId: 1,
        locationName: 'Sleepycat worli',
        ratings: 1000,
        averageRating: 4,
      },
      {
        locationId: 2,
        locationName: 'Sleepycat worli',
        ratings: 1000,
        averageRating: 4,
      },
      {
        locationId: 3,
        locationName: 'Sleepycat worli',
        ratings: 1000,
        averageRating: 4,
      },
      {
        locationId: 4,
        locationName: 'Sleepycat worli',
        ratings: 1000,
        averageRating: 4,
      },
      {
        locationId: 5,
        locationName: 'Sleepycat worli',
        ratings: 1000,
        averageRating: 4,
      },
    ],
    lowestReviewLocations: [
      {
        locationId: 1,
        locationName: 'Sleepycat worli',
        ratings: 1000,
        averageRating: 4,
      },
      {
        locationId: 2,
        locationName: 'Sleepycat worli',
        ratings: 1000,
        averageRating: 4,
      },
      {
        locationId: 3,
        locationName: 'Sleepycat worli',
        ratings: 1000,
        averageRating: 4,
      },
      {
        locationId: 4,
        locationName: 'Sleepycat worli',
        ratings: 1000,
        averageRating: 4,
      },
      {
        locationId: 5,
        locationName: 'Sleepycat worli',
        ratings: 1000,
        averageRating: 4,
      },
    ],
    reviewSentiment: {
      pieData: [
        { name: 'Positive', value: 60 },
        { name: 'Negative', value: 30 },
        { name: 'Neutral', value: 10 },
      ],
      // lastMonth: 75,
      // sentiment: {
      //   value: 2.4,
      //   trend: 'up',
      // },
    },
    ratingsBreakdown: {
      // NOTE: Value of all stars is in percentage aprat from averageRating this is different
      fiveStar: 90,
      fourStar: 60,
      threeStar: 40,
      twoStar: 40,
      oneStar: 40,
    },
    reviewsChart: [
      { month: 'Jan', totalReviews: 246, totalRating: 388 },
      { month: 'Feb', totalReviews: 310, totalRating: 420 },
      { month: 'Mar', totalReviews: 455, totalRating: 560 },
      { month: 'Apr', totalReviews: 380, totalRating: 510 },
      { month: 'May', totalReviews: 520, totalRating: 640 },
      { month: 'Jun', totalReviews: 610, totalRating: 720 },
      { month: 'Jul', totalReviews: 580, totalRating: 690 },
      { month: 'Aug', totalReviews: 710, totalRating: 820 },
      { month: 'Sep', totalReviews: 790, totalRating: 900 },
      { month: 'Oct', totalReviews: 860, totalRating: 950 },
      { month: 'Nov', totalReviews: 920, totalRating: 980 },
      { month: 'Dec', totalReviews: 840, totalRating: 910 },
    ],

    // TODO: graph pending
  },
  posts: {
    postsSummary: {
      totalPosts: 216,
      unDeployedPosts: 200,
    },
    topPostLocations: [
      {
        id: 1,
        locationName: 'Sleepycat worli',
        averagePosts: 1000,
      },
      {
        id: 2,
        locationName: 'Sleepycat worli',
        averagePosts: 1000,
      },
      {
        id: 3,
        locationName: 'Sleepycat worli',
        averagePosts: 1000,
      },
      {
        id: 4,
        locationName: 'Sleepycat worli',
        averagePosts: 1000,
      },
      {
        id: 5,
        locationName: 'Sleepycat worli',
        averagePosts: 1000,
      },
    ],
    leastPostLocations: [
      {
        id: 1,
        locationName: 'Sleepycat worli',
        averagePosts: 1000,
      },
      {
        id: 2,
        locationName: 'Sleepycat worli',
        averagePosts: 1000,
      },
      {
        id: 3,
        locationName: 'Sleepycat worli',
        averagePosts: 1000,
      },
      {
        id: 4,
        locationName: 'Sleepycat worli',
        averagePosts: 1000,
      },
      {
        id: 5,
        locationName: 'Sleepycat worli',
        averagePosts: 1000,
      },
    ],
    postsGraphData: [
      { month: 'Jan', totalGMBPosts: 320, totalFbPosts: 210 },
      { month: 'Feb', totalGMBPosts: 410, totalFbPosts: 290 },
      { month: 'Mar', totalGMBPosts: 560, totalFbPosts: 430 },
      { month: 'Apr', totalGMBPosts: 480, totalFbPosts: 350 },
      { month: 'May', totalGMBPosts: 620, totalFbPosts: 510 },
      { month: 'Jun', totalGMBPosts: 700, totalFbPosts: 590 },
      { month: 'Jul', totalGMBPosts: 10, totalFbPosts: 530 },
      { month: 'Aug', totalGMBPosts: 780, totalFbPosts: 640 },
      { month: 'Sep', totalGMBPosts: 860, totalFbPosts: 720 },
      { month: 'Oct', totalGMBPosts: 910, totalFbPosts: 810 },
      { month: 'Nov', totalGMBPosts: 970, totalFbPosts: 880 },
      { month: 'Dec', totalGMBPosts: 890, totalFbPosts: 760 },
    ],
  },
  googleBusinessInsights: {
    summary: {
      totalSearches: 1000,
      totalMapViews: 100,
      callsInitiated: 100,
      websiteClicks: 1000,
      drivingDirectionReq: 1000,
    },
    mapSearchTrends: [
      { month: 'Jan', totalActions: 320, totalViews: 210 },
      { month: 'Feb', totalActions: 410, totalViews: 290 },
      { month: 'Mar', totalActions: 560, totalViews: 430 },
      { month: 'Apr', totalActions: 480, totalViews: 350 },
      { month: 'May', totalActions: 620, totalViews: 510 },
      { month: 'Jun', totalActions: 700, totalViews: 590 },
      { month: 'Jul', totalActions: 650, totalViews: 530 },
      { month: 'Aug', totalActions: 780, totalViews: 640 },
      { month: 'Sep', totalActions: 860, totalViews: 720 },
      { month: 'Oct', totalActions: 910, totalViews: 810 },
      { month: 'Nov', totalActions: 970, totalViews: 880 },
      { month: 'Dec', totalActions: 890, totalViews: 760 },
    ],

    // TODO: breakdown graph data
  },
  socialMediaInsights: {
    summary: {
      followers: {
        value: 1000,
        percentage: 10,
      },
      totalLikes: {
        value: 5444,
        percentage: 100,
      },
      totalShares: {
        value: 460,
        percentage: 1.8,
      },
      totalPosts: {
        value: 316,
        percentage: 100,
      },
      pendingApproval: {
        value: 200,
        percentage: 1.8,
      },
    },

    // TODO: graph later
  },
};

// TODO: no design token exists for '#F27B45' (Negative) — needs manual review
export const PIE_COLORS = ['var(--color-success-300)', '#F27B45', 'var(--color-gray-300)']; // Positive, Negative, Neutral
