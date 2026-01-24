/**
 * Feature Flags Configuration
 * 
 * Toggle features on/off by changing the boolean values below.
 * Changes take effect immediately in development mode.
 */

export const FEATURES = {
  /**
   * Data Collection Game
   * 
   * Controls whether the "COLLECT DATA" button and game appear on the homepage.
   * 
   * Set to `true` to enable the game
   * Set to `false` to hide the game button and disable the game
   */
  DATA_COLLECTION_GAME: true,
} as const;
