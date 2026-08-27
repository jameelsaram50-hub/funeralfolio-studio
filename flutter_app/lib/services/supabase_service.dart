import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/models.dart';

class SupabaseService {
  static final SupabaseService instance = SupabaseService._internal();
  SupabaseService._internal();

  static const String supabaseUrl = 'https://zpcgpdsydpzpfpheorkl.supabase.co';
  static const String supabaseAnonKey = 'sb_publishable_HaPvhliGNX3fuhXIznhk-g_887G2IZ1';

  bool _isInitialized = false;

  Future<void> init() async {
    try {
      if (!supabaseAnonKey.contains('placeholder')) {
        await Supabase.initialize(
          url: supabaseUrl,
          publishableKey: supabaseAnonKey,
        );
        _isInitialized = true;
      }
    } catch (e) {
      debugPrint('Supabase Flutter init fallback to local: $e');
    }
  }

  SupabaseClient? get client {
    if (_isInitialized) {
      try {
        return Supabase.instance.client;
      } catch (_) {
        return null;
      }
    }
    return null;
  }

  // -------------------------------------------------------------
  // 1. Memorials Service
  // -------------------------------------------------------------
  Future<List<Memorial>> getMemorials() async {
    if (client != null) {
      try {
        final res = await client!
            .from('memorials')
            .select()
            .order('created_at', ascending: false);
        if (res.isNotEmpty) {
          return (res as List).map((j) => Memorial.fromJson(j)).toList();
        }
      } catch (e) {
        debugPrint('Error fetching memorials from Supabase: $e');
      }
    }

    // Local cache fallback
    final prefs = await SharedPreferences.getInstance();
    final cached = prefs.getString('cached_memorials');
    if (cached != null) {
      final List list = jsonDecode(cached);
      return list.map((j) => Memorial.fromJson(j)).toList();
    }

    return [
      Memorial(
        id: 'mem-101',
        name: 'Eleanor Vance',
        birthDate: '1942-04-14',
        deathDate: '2026-08-10',
        format: 'Bi-fold Program',
        biography: 'A devoted educator and loving mother whose garden and wisdom nurtured all.',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
      ),
      Memorial(
        id: 'mem-102',
        name: 'Bailey Marie Bryce',
        birthDate: '1998-03-21',
        deathDate: '2026-08-08',
        format: 'Tri-fold & Cards',
        biography: 'Bright, courageous soul who brought joy and music wherever she went.',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
      ),
    ];
  }

  Future<Memorial> saveMemorial(Memorial memorial) async {
    if (client != null) {
      try {
        final res = await client!
            .from('memorials')
            .upsert(memorial.toJson())
            .select()
            .single();
        return Memorial.fromJson(res);
      } catch (e) {
        debugPrint('Error saving memorial to Supabase: $e');
      }
    }

    final prefs = await SharedPreferences.getInstance();
    final current = await getMemorials();
    final filtered = current.where((m) => m.id != memorial.id).toList();
    final updated = [memorial, ...filtered];
    await prefs.setString('cached_memorials', jsonEncode(updated.map((m) => m.toJson()).toList()));
    return memorial;
  }

  // -------------------------------------------------------------
  // 2. Obituaries Service
  // -------------------------------------------------------------
  Future<List<Obituary>> getObituaries() async {
    if (client != null) {
      try {
        final res = await client!
            .from('obituaries')
            .select()
            .order('created_at', ascending: false);
        return (res as List).map((j) => Obituary.fromJson(j)).toList();
      } catch (e) {
        debugPrint('Error fetching obituaries from Supabase: $e');
      }
    }

    final prefs = await SharedPreferences.getInstance();
    final cached = prefs.getString('cached_obituaries');
    if (cached != null) {
      final List list = jsonDecode(cached);
      return list.map((j) => Obituary.fromJson(j)).toList();
    }
    return [];
  }

  Future<Obituary> saveObituary(Obituary obituary) async {
    if (client != null) {
      try {
        final res = await client!
            .from('obituaries')
            .upsert(obituary.toJson())
            .select()
            .single();
        return Obituary.fromJson(res);
      } catch (e) {
        debugPrint('Error saving obituary to Supabase: $e');
      }
    }

    final prefs = await SharedPreferences.getInstance();
    final current = await getObituaries();
    final filtered = current.where((o) => o.id != obituary.id).toList();
    final updated = [obituary, ...filtered];
    await prefs.setString('cached_obituaries', jsonEncode(updated.map((o) => o.toJson()).toList()));
    return obituary;
  }

  // -------------------------------------------------------------
  // 3. Condolences Service
  // -------------------------------------------------------------
  Future<List<Condolence>> getCondolences(String memorialId) async {
    if (client != null) {
      try {
        final res = await client!
            .from('condolences')
            .select()
            .eq('memorial_id', memorialId)
            .order('created_at', ascending: false);
        return (res as List).map((j) => Condolence.fromJson(j)).toList();
      } catch (e) {
        debugPrint('Error fetching condolences from Supabase: $e');
      }
    }

    final prefs = await SharedPreferences.getInstance();
    final cached = prefs.getString('cached_condolences_$memorialId');
    if (cached != null) {
      final List list = jsonDecode(cached);
      return list.map((j) => Condolence.fromJson(j)).toList();
    }

    return [
      Condolence(
        id: 'c-1',
        memorialId: memorialId,
        guestName: 'The Campbell Family',
        message: 'A truly beautiful soul who touched every life she came across. Rest in eternal peace.',
        relationship: 'Lifelong Friends',
        candleLit: true,
      ),
      Condolence(
        id: 'c-2',
        memorialId: memorialId,
        guestName: 'Marcus & Linda Lee',
        message: 'Forever remembered for your kindness, warm laughter, and unmatched grace.',
        relationship: 'Colleagues',
        candleLit: true,
      ),
    ];
  }

  Future<Condolence> addCondolence(Condolence condolence) async {
    if (client != null) {
      try {
        final res = await client!
            .from('condolences')
            .insert(condolence.toJson())
            .select()
            .single();
        return Condolence.fromJson(res);
      } catch (e) {
        debugPrint('Error adding condolence to Supabase: $e');
      }
    }

    final prefs = await SharedPreferences.getInstance();
    final current = await getCondolences(condolence.memorialId);
    final updated = [condolence, ...current];
    await prefs.setString('cached_condolences_${condolence.memorialId}', jsonEncode(updated.map((c) => c.toJson()).toList()));
    return condolence;
  }

  // -------------------------------------------------------------
  // 4. AI Generation Service
  // -------------------------------------------------------------
  Future<String> generateAIObituary({
    required String name,
    required String dob,
    required String dod,
    required String birthplace,
    required String career,
    required String survivors,
    required String traits,
    required String tone,
  }) async {
    // Attempt to call local or remote backend API
    try {
      final prompt = 'Write a dignified, beautiful obituary for $name, born $dob in $birthplace, passed away $dod. Career: $career. Family: $survivors. Traits: $traits. Tone: $tone.';
      final res = await http.post(
        Uri.parse('http://10.0.2.2:3000/api/generate-obituary'), // Android emulator host alias
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'prompt': prompt}),
      ).timeout(const Duration(seconds: 4));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data['text'] != null) return data['text'];
      }
    } catch (_) {
      // Fallback to high-quality template synthesis
    }

    return '''Our beloved $name, born on $dob in $birthplace, peacefully departed this life on $dod.

$name lived a life defined by $traits. A distinguished career was built with devotion in $career, leaving an indelible mark on everyone who had the privilege to work alongside them.

They are lovingly remembered and survived by $survivors. Their profound warmth, generosity of spirit, and unwavering strength will forever resonate in the hearts of family and dear friends.

"Those we love never truly leave us. They live on in every act of kindness and memory they left behind."''';
  }

  // -------------------------------------------------------------
  // 5. Orders Service
  // -------------------------------------------------------------
  Future<List<Order>> getOrders() async {
    if (client != null) {
      try {
        final res = await client!
            .from('orders')
            .select()
            .order('created_at', ascending: false);
        if (res.isNotEmpty) {
          return (res as List).map((j) => Order.fromJson(j)).toList();
        }
      } catch (e) {
        debugPrint('Error fetching orders from Supabase: $e');
      }
    }

    final prefs = await SharedPreferences.getInstance();
    final cached = prefs.getString('cached_orders');
    if (cached != null) {
      final List list = jsonDecode(cached);
      return list.map((j) => Order.fromJson(j)).toList();
    }

    return [
      Order(
        id: 'ORD-8921',
        customerName: 'Sarah Jenkins',
        customerEmail: 'sarah.j@example.com',
        packageName: 'Full Coordinated Suite + 100 Prints',
        amount: 149.00,
        status: 'Shipped',
        trackingNumber: '940011189956',
        createdAt: DateTime.now().subtract(const Duration(days: 2)),
      ),
      Order(
        id: 'ORD-8920',
        customerName: 'Robert Vance',
        customerEmail: 'robert.vance@example.com',
        packageName: 'Digital High-Res Print Package',
        amount: 39.00,
        status: 'Paid',
        downloadUrl: 'https://funeralfolio.com/downloads/vance-suite.pdf',
        createdAt: DateTime.now().subtract(const Duration(days: 3)),
      ),
    ];
  }

  Future<Order> saveOrder(Order order) async {
    if (client != null) {
      try {
        final res = await client!
            .from('orders')
            .upsert(order.toJson())
            .select()
            .single();
        return Order.fromJson(res);
      } catch (e) {
        debugPrint('Error saving order to Supabase: $e');
      }
    }

    final prefs = await SharedPreferences.getInstance();
    final current = await getOrders();
    final filtered = current.where((o) => o.id != order.id).toList();
    final updated = [order, ...filtered];
    await prefs.setString('cached_orders', jsonEncode(updated.map((o) => o.toJson()).toList()));
    return order;
  }
}

