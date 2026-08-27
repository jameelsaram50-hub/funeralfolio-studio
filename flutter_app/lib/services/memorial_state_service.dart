import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/models.dart';
import 'supabase_service.dart';

class MemorialStateService extends ChangeNotifier {
  static final MemorialStateService instance = MemorialStateService._internal();
  MemorialStateService._internal();

  static const String _storageKey = 'active_memorial_draft_v2';

  late Memorial _activeMemorial;
  bool _isInitialized = false;

  Memorial get activeMemorial => _activeMemorial;
  Memorial get draft => _activeMemorial;
  bool get isInitialized => _isInitialized;

  Future<void> init() async {
    if (_isInitialized) return;

    final prefs = await SharedPreferences.getInstance();
    final cached = prefs.getString(_storageKey);

    if (cached != null) {
      try {
        final Map<String, dynamic> json = jsonDecode(cached);
        _activeMemorial = Memorial.fromJson(json);
      } catch (e) {
        debugPrint('Error parsing cached draft memorial: $e');
        _activeMemorial = _createDefaultMemorial();
      }
    } else {
      _activeMemorial = _createDefaultMemorial();
    }

    _isInitialized = true;
    notifyListeners();
  }

  Memorial _createDefaultMemorial() {
    return Memorial(
      id: 'mem-${DateTime.now().millisecondsSinceEpoch}',
      name: 'Eleanor Vance',
      birthDate: 'March 15, 1942',
      deathDate: 'January 12, 2026',
      birthPlace: 'Savannah, Georgia',
      serviceDate: 'Friday, May 22, 2026 at 2:00 PM',
      serviceLocation: 'The Historic Serenity Chapel, Savannah GA',
      biography:
          'Eleanor Vance was a dedicated educator, a passionate gardener, and a cherished grandmother whose radiant warmth touched all who knew her. For 35 years she guided generations of students with patience, grace, and an enduring smile.',
      photoUrl:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
      themeColor: '#1e293b',
      format: 'Bi-fold Program',
      status: 'Active',
      career: 'Dedicated High School Educator & Community Mentor',
      survivors: 'Children Julia and David, 4 grandchildren, loving sister Clara',
      personalTraits: 'Boundless kindness, radiant warmth, and quick wit',
      quote:
          '"Her life was a blessing, her memory a treasure. She is loved beyond words and missed beyond measure."',
      themeId: 'celestial-gold',
      productId: 'bifold',
      orderOfService:
          '• Musical Prelude\n• Welcome & Opening Prayer — Rev. Thomas\n• Reading: Psalm 23\n• Family Reflections & Tributes\n• Musical Blessing: "Amazing Grace"\n• Benediction & Committal',
      prayerVerse:
          'The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. (Psalm 23)',
      pallbearers: 'David Vance, Marcus Lee, Jonathan Hayes, Robert Campbell',
    );
  }

  Future<void> updateMemorial(Memorial updated, {bool syncWithSupabase = false}) async {
    _activeMemorial = updated;
    notifyListeners();
    await _persistLocal();

    if (syncWithSupabase) {
      await SupabaseService.instance.saveMemorial(_activeMemorial);
    }
  }

  Future<void> updateFields({
    String? name,
    String? birthDate,
    String? deathDate,
    String? birthPlace,
    String? serviceDate,
    String? serviceLocation,
    String? biography,
    String? photoUrl,
    String? quote,
    String? career,
    String? survivors,
    String? personalTraits,
    String? themeId,
    String? productId,
    String? format,
    String? orderOfService,
    String? prayerVerse,
    String? pallbearers,
    bool syncWithSupabase = false,
  }) async {
    _activeMemorial = _activeMemorial.copyWith(
      name: name,
      birthDate: birthDate,
      deathDate: deathDate,
      birthPlace: birthPlace,
      serviceDate: serviceDate,
      serviceLocation: serviceLocation,
      biography: biography,
      photoUrl: photoUrl,
      quote: quote,
      career: career,
      survivors: survivors,
      personalTraits: personalTraits,
      themeId: themeId,
      productId: productId,
      format: format,
      orderOfService: orderOfService,
      prayerVerse: prayerVerse,
      pallbearers: pallbearers,
    );

    notifyListeners();
    await _persistLocal();

    if (syncWithSupabase) {
      await SupabaseService.instance.saveMemorial(_activeMemorial);
    }
  }

  Future<void> updateDraft({
    String? name,
    String? birthDate,
    String? deathDate,
    String? birthPlace,
    String? serviceDate,
    String? serviceLocation,
    String? biography,
    String? photoUrl,
    String? quote,
    String? career,
    String? survivors,
    String? personalTraits,
    String? themeId,
    String? productId,
    String? format,
    String? orderOfService,
    String? prayerVerse,
    String? pallbearers,
    bool syncWithSupabase = false,
  }) =>
      updateFields(
        name: name,
        birthDate: birthDate,
        deathDate: deathDate,
        birthPlace: birthPlace,
        serviceDate: serviceDate,
        serviceLocation: serviceLocation,
        biography: biography,
        photoUrl: photoUrl,
        quote: quote,
        career: career,
        survivors: survivors,
        personalTraits: personalTraits,
        themeId: themeId,
        productId: productId,
        format: format,
        orderOfService: orderOfService,
        prayerVerse: prayerVerse,
        pallbearers: pallbearers,
        syncWithSupabase: syncWithSupabase,
      );

  Future<void> _persistLocal() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_storageKey, jsonEncode(_activeMemorial.toJson()));
    } catch (e) {
      debugPrint('Failed to persist memorial draft locally: $e');
    }
  }

  Future<void> resetToNewDraft() async {
    _activeMemorial = Memorial(
      id: 'mem-${DateTime.now().millisecondsSinceEpoch}',
      name: '',
      birthDate: '',
      deathDate: '',
      birthPlace: '',
      serviceDate: '',
      serviceLocation: '',
      biography: '',
      quote: '',
      career: '',
      survivors: '',
      personalTraits: '',
      themeId: 'celestial-gold',
      productId: 'bifold',
    );
    notifyListeners();
    await _persistLocal();
  }
}
